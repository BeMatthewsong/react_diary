import React from "react";
import DiaryItem from "./DiaryItem";

const DiaryList = ({ diaryList, onRemove, onEdit }) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((data) => (
          <DiaryItem
            key={data.id}
            onEdit={onEdit}
            onRemove={onRemove}
            {...data}
          />
        ))}
      </div>
    </div>
  );
};

// undefined 막기 위해 사용
DiaryList.defaultProps = { diaryList: [] };

export default DiaryList;
