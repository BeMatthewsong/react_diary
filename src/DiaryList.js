import React, { useContext } from "react";
import DiaryItem from "./DiaryItem";
import { DiaryStateContext } from "./App";

const DiaryList = () => {
  // Context에서 데이터 가져오기 (useContext)
  const diaryList = useContext(DiaryStateContext);

  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((data) => (
          <DiaryItem key={data.id} {...data} />
        ))}
      </div>
    </div>
  );
};

// undefined 막기 위해 사용
DiaryList.defaultProps = { diaryList: [] };

export default DiaryList;
