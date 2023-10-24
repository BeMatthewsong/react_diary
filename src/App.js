import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

function App() {
  const BASE_URL = "https://jsonplaceholder.typicode.com/comments";
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  const getData = async () => {
    const res = await fetch(BASE_URL);
    const result = await res.json();

    const initData = result.slice(0, 10).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1, // 감정 값은 API에 없으니 임의로 만들자
        created_date: new Date().getTime(),
        id: dataId.current++, // 요소 하나씩 렌더링될 때마다 id값을 하나씩 올리기
      };
    });

    setData(initData);
  };

  // Mount 되자마자 API에서 데이터 불러오기
  useEffect(() => {
    getData();
  }, []);

  // useCallback으로 의존성배열이 바뀔 때마다 메모제이션된 콜백함수를 실행해서 반환
  // onCreate가 바뀌면 자식 컴포넌트도 리렌더링 되어서 불필요한 리렌더링 발생 >> 해결방안: useCallback 필요
  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData((data) => [newItem, ...data]); // 새로운 게시물은 맨 위로 그리고 함수형 업데이트를 해야지 이전 것까지 다 불러올 수 있다.
  }, []);

  const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((it) => it.id !== targetId)); // 최신 state 사용하기 위해서 함수형 업데이트
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map(
        (item) =>
          item.id === targetId ? { ...item, content: newContent } : item // 참일 때 게시물의 정보를 남긴 채 컨텐츠 부분만 newContent로 바꾸겠다.
      )
    );
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; // useMemo는 값이므로 함수가 아니다. 그래서 호출하면 안 된다.

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {~~goodRatio}%</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
