import React, { useLayoutEffect, useState } from 'react';
import { PillData } from './data';
import { Pill } from './Pill';

const PILL_HEADER_WIDTH = 22; // 8px for the margin + 13.(3)px for the letter H, approx. up

interface PillsProps {
  pills: PillData[];
  headers: string[]; // ids of pills that are toggled on
  toggleHeader: (id: string) => void;
}

interface LayoutBreakElement {
  index: string;
  type: 'line-break';
}

interface LayoutPillElement {
  index: string;
  type: 'pill';
  pill: PillData;
}

type LayoutElement = LayoutBreakElement | LayoutPillElement;

interface PillNode extends PillData {
  maxWidth: number;
}

type PillRefs = { [id: PillData['id']]: HTMLDivElement };

export const useWindowWidth = (): number => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const updateWindowWidth = () => {
    setWindowWidth(window.innerWidth);
  };

  useLayoutEffect(() => {
    window.addEventListener('resize', updateWindowWidth);

    return () => window.removeEventListener('resize', updateWindowWidth);
  }, []);

  return windowWidth;
};

const createPillNodes = (
  pills: PillData[],
  pillRefs: PillRefs,
  headers: string[]
): PillNode[] =>
  pills.map((pill) => {
    const pillNode = pillRefs[pill.id];
    const currentPillWidth = pillNode?.getBoundingClientRect().width;
    const maxWidth = headers.includes(pill.id)
      ? currentPillWidth
      : currentPillWidth + PILL_HEADER_WIDTH;

    return { ...pill, maxWidth };
  });

const createLayoutElements = (
  containerWidth: number,
  pillNodes: PillNode[]
): LayoutElement[] => {
  const { rows, currentRow } = pillNodes.reduce(
    ({ rows, currentRow }, pill) => {
      const layoutElement: LayoutPillElement = {
        index: pill.id,
        type: 'pill',
        pill,
      };

      if (currentRow.width + pill.maxWidth >= containerWidth) {
        const lineBreak: LayoutBreakElement = {
          type: 'line-break',
          index: String(rows.length),
        };

        currentRow.items.push(lineBreak);
        rows.push(currentRow.items);

        currentRow.width = pill.maxWidth;
        currentRow.items = [layoutElement];
      } else {
        currentRow.items.push(layoutElement);
        currentRow.width += pill.maxWidth;
      }

      return { rows, currentRow };
    },
    {
      rows: [] as LayoutElement[][],
      currentRow: { items: [] as LayoutElement[], width: 0 },
    }
  );

  return rows.concat(currentRow.items).flatMap((row) => row);
};

export function Pills({ pills, headers, toggleHeader }: PillsProps) {
  const containerNode = React.useRef<HTMLDivElement>(null);
  const pillRefs = React.useRef<PillRefs>({});
  const windowWidth = useWindowWidth();

  const [layoutElements, setLayoutElements] = React.useState<LayoutElement[]>(
    () => {
      return pills.map((pill) => ({
        index: pill.id,
        type: 'pill',
        pill: pill,
      }));
    }
  );

  useLayoutEffect(() => {
    if (!containerNode.current) {
      return;
    }

    const containerWidth = containerNode.current.getBoundingClientRect().width;
    const pillNodes = createPillNodes(pills, pillRefs.current, headers);

    setLayoutElements(createLayoutElements(containerWidth, pillNodes));
  }, [pills, windowWidth]);

  const setPillRef = (id: PillData['id'], node: HTMLDivElement) => {
    if (node) {
      pillRefs.current[id] = node;
    }
  };

  return (
    <div ref={containerNode}>
      {layoutElements.map((el) => {
        if (el.type === 'line-break') {
          return <br key={`__${el.type}-${el.index}`} />;
        } else {
          return (
            <Pill
              key={el.pill.id}
              header={headers.includes(el.pill.id)}
              onClick={() => {
                toggleHeader(el.pill.id);
              }}
              ref={(element) => element && setPillRef(el.pill.id, element)}
            >
              {el.pill.value}
            </Pill>
          );
        }
      })}
    </div>
  );
}
