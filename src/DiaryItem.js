import React, { useEffect, useRef, useState } from "react";

const DiaryItem = ({
  author,
  content,
  emotion,
  created_date,
  id,
  onRemove,
  onEdit,
}) => {
  useEffect(() => {
    console.log(`${id}번째 아이템 렌더`);
  });

  const [isEdit, setIsEdit] = useState(false); // 수정이 가능한 상태인지 판별
  const [localContent, setLocalContent] = useState(content);
  const localContentInput = useRef();

  const toggleIsEdit = () => setIsEdit(!isEdit);

  const handleRemove = () => {
    if (window.confirm(`${id}번째 일기를 삭제하시겠습니까`)) {
      onRemove(id);
    }
  };

  const handleEdit = () => {
    if (localContent.length < 5) {
      localContentInput.current.focus();
      return;
    }
    if (window.confirm(`${id}번째 일기를 수정하시겠습니까`)) {
      onEdit(id, localContent);
      toggleIsEdit();
    }
  };

  const handleQuitEdit = () => {
    setIsEdit(false);
    setLocalContent(content); // 원래 있던 내용을 표시
  };

  return (
    <div className="DiaryItem">
      <div className="info">
        <span>
          작성자 : {author} | 감정 점수 : {emotion}
        </span>
        <br />
        <span className="date">
          {new Date(created_date).toLocaleDateString()}
        </span>
      </div>
      <div className="content">
        {isEdit ? (
          <>
            <textarea
              ref={localContentInput}
              value={localContent}
              onChange={(e) => setLocalContent(e.target.value)}
            />
          </>
        ) : (
          <>{content}</>
        )}
      </div>
      {isEdit ? (
        <>
          <button onClick={handleQuitEdit}>수정 취소</button>
          <button onClick={handleEdit}>수정 완료</button>
        </>
      ) : (
        <>
          <button onClick={handleRemove}>삭제</button>
          <button onClick={toggleIsEdit}>수정</button>
        </>
      )}
    </div>
  );
};

export default React.memo(DiaryItem);
// React.memo로 props가 바뀌지 않는 이상 리렌더링되지 않는다
// 하지만 props로 받는 onRemove, onEdit은 부모 컴포넌트에서 리렌더링되어 props까지 영향을 받는다.
// 그래서 useCallback으로 props에 있는 것을 손봐야 한다.
