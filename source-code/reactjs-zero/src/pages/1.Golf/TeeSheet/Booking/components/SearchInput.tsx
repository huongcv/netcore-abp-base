// SearchInput.tsx
import React, {useRef, useState} from "react";
import {useStore} from "@ord-store/index";
import Utils from "@ord-core/utils/utils";
import {slotName} from "@pages/1.Golf/TeeSheet/Booking/Scheduler/ExtFunction";
import {Button, Input, InputRef, Popover, Tooltip} from "antd";
import {ArrowDownOutlined, ArrowUpOutlined, CloseCircleOutlined, SearchOutlined} from "@ant-design/icons";

const SearchInput = (props: {
    boardId: number;
}) => {
    const [value, setValue] = useState("");
    const {
        golfBookingStore: mainStore,
    } = useStore();
    const [matchedElements, setMatchedElements] = useState<HTMLElement[]>([]);
    const [lstId, setListId] = useState<string[]>([]);
    const [visible, setVisible] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [filterValue, setFilterValue] = useState("");
    const inputRef = useRef<InputRef | null>(null);

    const highlightMatches = (lstIdIp: string[]) => {
        const results: HTMLElement[] = [];
        const tempList: string[] = [];

        lstIdIp.forEach((id) => {
            const container = document.getElementById(id);
            if (!container) return;

            tempList.push(id);

            // Duyệt toàn bộ phần tử con
            const children = container.querySelectorAll("*");

            children.forEach((el) => {
                const text = el.textContent || "";
                if (!text.trim()) return;

                const span = document.createElement("span");
                span.innerHTML = `<mark class="highlighted">${text}</mark>`;
                el.innerHTML = "";
                el.appendChild(span);

                results.push(span.querySelector("mark") as HTMLElement);
            });
        });

        setListId(tempList);
        setMatchedElements(results);
        setTotalCount(results.length);
        setCurrentIndex(0);

        if (results.length > 0) scrollTo(results[0]);
    };


    const clearHighlights = () => {
        lstId.filter(id => {
            const root = document.getElementById(id);
            if (root) {
                const highlights = root.querySelectorAll("mark.highlighted");
                highlights.forEach((mark) => {
                    const text = document.createTextNode(mark.textContent || "");
                    mark.parentNode?.replaceChild(text, mark);
                });
            }
        })

    };
    const scrollTo = (current: HTMLElement) => {
        current?.scrollIntoView({behavior: "smooth", block: "center"});
    }

    const handerKeyDownEnter = (e: React.KeyboardEvent) => {
        if (value) {
            const valSearch = Utils.toLowerCaseNonAccentVietnamese(value.trim());
            if (valSearch !== filterValue) {
                clearHighlights();
                console.log("valSearch", valSearch)
                setFilterValue(valSearch);
                const lstId: string[] = [];
                Object.entries(mainStore.teeTimeMap[props.boardId])
                    .forEach(([_, teeTime], rowIndex) => {
                        // const listSlot = teeTime.listSlot
                        teeTime.listSlot?.forEach((slot, colIndex) => {
                            const txtSearch = slot.groupName || slot.partnerName;
                            const txtLow = Utils.toLowerCaseNonAccentVietnamese(txtSearch);
                            const check = txtLow.includes(valSearch);
                            if (check) {
                                const f = slotName(props.boardId, rowIndex, colIndex)
                                lstId.push(f);
                            }
                        })
                    })
                console.log("lstIdFi", lstId)
                highlightMatches(lstId);

            } else {
                console.log("OnNext")
                onNext();
            }

        } else {
            clearAllData()
        }

    }

    function onPrev() {
        if (matchedElements.length === 0) return;

        setCurrentIndex((prev) => {
            const nextIndex = (prev - 1 + matchedElements.length) % matchedElements.length;
            scrollTo(matchedElements[nextIndex]);
            // setTimeout(scrollToCurrent, 50);
            return nextIndex;
        });
    }

    function onNext() {
        if (matchedElements.length === 0) return;
        setCurrentIndex((prev) => {
            const nextIndex = (prev + 1) % matchedElements.length;
            setTimeout(() => {
                scrollTo(matchedElements[nextIndex]);
            }, 50);
            return nextIndex;
        });
    }


    function clearAllData() {
        clearHighlights();
        setValue("");
        setMatchedElements([]);
        setListId([]);
        setTotalCount(0);
        setCurrentIndex(0);
        setFilterValue("");
    }

    function onClose() {
        setVisible(false);
        clearAllData();
    }

    return (
        <Popover
            placement='bottomLeft'
            onOpenChange={(open) => {
                if (!open) {
                    setVisible(false);
                    clearAllData();
                }
            }}
            overlayInnerStyle={{
                padding: 0
            }}
            open={visible}
            trigger='click' showArrow={false} content={<>
            <div className="flex items-center gap-2 p-2 border rounded shadow bg-white w-fit">
                <Input
                    value={value}
                    ref={inputRef}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handerKeyDownEnter(e);
                        } else if (e.key === "Down" || e.key === "ArrowDown") {
                            onNext();
                        } else if (e.key === "Up" || e.key === "ArrowUp") {
                            onPrev();
                        } else if (e.key === "Escape") {
                            onClose();
                        }
                    }}
                    onChange={(e) => {
                        setValue(e.target.value)
                        if (!e.target.value) {
                            clearAllData();
                        }
                    }}
                    className="w-80"
                    suffix={<>
                               <span className="text-xs text-gray-500 w-10 text-center">
                                {totalCount === 0 ? `0/0` : `${currentIndex + 1}/${totalCount}`}
                                </span>
                    </>}
                    placeholder="Nhập tên người chơi, tên nhóm để tìm kiếm"
                    allowClear
                />

                <div className="border-l h-5"></div>
                {/* Case-sensitive icon mock */}
                {/*<div className="text-gray-500 text-sm font-semibold px-2 cursor-pointer">*/}
                {/*    <span>ab</span>/<span className="font-bold">AB</span>*/}
                {/*</div>*/}
                <Button
                    size="small"
                    icon={<ArrowUpOutlined/>}
                    onClick={onPrev}
                    type="text"
                />
                <Button
                    size="small"
                    icon={<ArrowDownOutlined/>}
                    onClick={onNext}
                    type="text"
                />
                <Button
                    size="small"
                    icon={<CloseCircleOutlined/>}
                    onClick={onClose}
                    type="text"
                />
            </div>
        </>}>
            <Tooltip title="Tìm kiếm">
                <Button type='link' size='large' onClick={() => {
                    setVisible(!visible);
                    setTimeout(() => {
                        inputRef.current?.focus(); // focus sau khi popover render
                    }, 100);
                }}>
                    <SearchOutlined/>

                </Button>
            </Tooltip>

        </Popover>
    );
};

export default SearchInput;
