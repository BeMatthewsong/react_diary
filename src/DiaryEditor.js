import React, { useRef, useState } from "react";

const DiaryEditor = ({ onCreate }) => {
  // DOM 조작
  const authorInput = useRef();
  const contentInput = useRef();

  // state 여러 개 한꺼번에 쓰기
  const [state, setstate] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  // 한 번에 입력 처리하기
  const handleChangeState = (e) => {
    setstate({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!state.author) {
      // focus
      authorInput.current.focus();
      return;
    }

    if (state.content.length < 5) {
      // focus
      contentInput.current.focus();
      return;
    }

    onCreate(state.author, state.content, state.emotion);
    alert("저장 성공");
  };

  return (
    <>
      <div className="DiaryEditor">
        <h2>오늘의 일기</h2>
        <input
          ref={authorInput}
          name="author"
          value={state.author}
          onChange={handleChangeState}
        />
        <div>
          <textarea
            ref={contentInput}
            name="content"
            value={state.content}
            onChange={handleChangeState}
          />
        </div>
        <div>
          오늘의 감정 점수
          <select
            name="emotion"
            value={state.emotion}
            onChange={handleChangeState}
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>
        <button onClick={handleSubmit}>일기 저장하기</button>
      </div>
    </>
  );
};

export default DiaryEditor;

// 클래스네임과 컴포넌트 이름과 동일시 하는 방법도 있다. (직관적)
// ...state는 먼저 작성해야 한다.
