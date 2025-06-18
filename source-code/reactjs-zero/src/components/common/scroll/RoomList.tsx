import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

interface Room {
    id: string;
    name: string;
    phone: string;
    status: string;
}

const fetchRooms = async (page: number, pageSize: number) => {
    // Call API của bạn ở đây
    // Ví dụ giả lập fetch:
    await new Promise(resolve => setTimeout(resolve, 500));
    const data = Array.from({ length: pageSize }, (_, index) => ({
        id: `${page}-${index}`,
        name: "B. A101",
        phone: "0364726841",
        status: "Đang dọn dẹp"
    }));
    return data;
};

const RoomList = () => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const pageSize = 20;

    const loadMore = async () => {
        const newRooms = await fetchRooms(page, pageSize);
        if (newRooms.length < pageSize) {
            setHasMore(false);
        }
        setRooms(prev => [...prev, ...newRooms]);
        setPage(prev => prev + 1);
    };

    useEffect(() => {
        loadMore();
    }, []);

    return (
        <InfiniteScroll
            dataLength={rooms.length}
            next={loadMore}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            height={600} // hoặc bỏ height nếu muốn scroll theo window
        >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {rooms.map(room => (
                    <div
                        key={room.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            width: "200px",
                            borderRadius: "6px"
                        }}
                    >
                        <p>{room.status}</p>
                        <h4>{room.name}</h4>
                        <p>{room.phone}</p>
                    </div>
                ))}
            </div>
        </InfiniteScroll>
    );
};

export default RoomList;