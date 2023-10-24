import React, { useRef, useState } from "react";

const DiaryItem = ({
  author,
  content,
  emotion,
  created_date,
  id,
  onRemove,
  onEdit,
}) => {
  const localContentInput = useRef();

  const [isEdit, setIsEdit] = useState(false); // 수정이 가능한 상태인지 판별
  const [localContent, setLocalContent] = useState(content);

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

export default DiaryItem;
