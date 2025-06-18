import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import './Scroll.scss'
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {TextLineClampDisplay} from "@ord-components/common/TextLineClampDisplay";

type ItemProps = {
    item: Record<string, any>;
    itemStyle?: React.CSSProperties;
    render?: (item: Record<string, any>, isActive: boolean) => React.ReactNode;
    isActive: boolean;
};

const Item = memo(({item, itemStyle, render, isActive}: ItemProps) => {
    const itemStyleDefault = useMemo(
        () => ({
            flex: "0 0 auto",
            width: 320,
            height: 56,
            marginRight: 10,
            borderRadius: 6,
            cursor: "pointer",
            padding: "6px 10px 10px",
            border: "2px solid",
            borderColor: '#E8E8E8',
            textAlign: 'center',
            scrollSnapAlign: "start"
        }), []
    );
    if (render) {
        return (
            <div>
                {render(item, isActive)}
            </div>
        )
    }

    return (
        <div
            style={(itemStyle || itemStyleDefault) as any}
            className={`${isActive ? '!border-[#22BA4F]' : ''}`}
        >
            <TextLineClampDisplay className='!text-base !font-medium !text-[#2D2D2D]' content={item.title || ''}/>
            <TextLineClampDisplay content={item.desc || ''}/>
        </div>
    );
});

type HorizontalScrollProps = {
    data: Record<string, any>[];
    onChange?: (v: Record<string, any>) => void;
    cardStyle?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
    render?: (item: Record<string, any>, isActive: boolean) => React.ReactNode;
    initialActiveId?: number | string | null;
    hiddenControls?: boolean | null;
};

const HorizontalScroll = ({
                              data,
                              onChange,
                              cardStyle,
                              itemStyle,
                              render,
                              initialActiveId,
                              hiddenControls,
                          }: HorizontalScrollProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [activeItemId, setActiveItemId] = useState(initialActiveId);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const isClickDisabled = useRef(false);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setScrollLeft(scrollRef.current?.scrollLeft || 0);
        document.body.style.userSelect = "none";
        if (scrollRef.current) scrollRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        const x = e.clientX;
        const walk = (x - startX) * 1.2;
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollLeft - walk;
        }
        if (Math.abs(walk) > 5) {
            isClickDisabled.current = true;
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = "auto";
        if (scrollRef.current) scrollRef.current.style.cursor = "grab";
        setTimeout(() => {
            isClickDisabled.current = false;
        }, 50);
    };

    const handleScrollLeft = () => {
        scrollRef.current?.scrollBy({left: -200, behavior: "smooth"});
    };

    const handleScrollRight = () => {
        scrollRef.current?.scrollBy({left: 200, behavior: "smooth"});
    };

    const cardStyleDefault = useMemo(
        () => ({
            display: "flex",
            overflowX: "auto",
            cursor: "grab",
            whiteSpace: "nowrap",
            gap: 2,
        }),
        []
    );

    const checkScrollPosition = () => {
        if (scrollRef.current) {
            const scrollWidth = scrollRef.current.scrollWidth;
            const clientWidth = scrollRef.current.clientWidth;
            const scrollLeft = scrollRef.current.scrollLeft;

            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
        }
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.addEventListener("scroll", checkScrollPosition);
            checkScrollPosition();
        }

        return () => {
            if (scrollRef.current) {
                scrollRef.current.removeEventListener("scroll", checkScrollPosition);
            }
        };
    }, []);

    return (
        <div className="relative w-full">
            {
                !hiddenControls && <>
                    <button
                        onClick={handleScrollLeft}
                        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow py-1 px-2 text-[#22BA4F] border border-solid border-current ${!canScrollLeft ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <LeftOutlined/>
                    </button>

                    <button
                        onClick={handleScrollRight}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow py-1 px-2 text-[#22BA4F] border border-solid border-current ${!canScrollRight ? 'opacity-0 pointer-events-none' : ''}`}
                    >
                        <RightOutlined/>
                    </button>
                </>
            }

            <div
                ref={scrollRef}
                className="hide-scrollbar"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
                onMouseUp={handleMouseUp}
                style={(cardStyle || cardStyleDefault) as any}
            >
                {data.map((item: any, idx: number) => (
                    <div
                        key={item.id}
                        onClick={() => {
                            if (isClickDisabled.current) return;
                            setActiveItemId(item.id);
                            onChange && onChange(item);
                        }}
                    >
                        <Item render={render} itemStyle={itemStyle} item={item} isActive={activeItemId === item.id}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default memo(HorizontalScroll);
