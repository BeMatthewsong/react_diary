import { useEffect, useRef, useState } from "react";
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

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]); // 새로운 게시물은 맨 위로
  };

  const onRemove = (targetId) => {
    const newDiaryList = data.filter((it) => it.id !== targetId); // 삭제
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    setData(
      data.map(
        (item) =>
          item.id === targetId ? { ...item, content: newContent } : item // 참일 때 게시물의 정보를 남긴 채 컨텐츠 부분만 newContent로 바꾸겠다.
      )
    );
  };

  return (
    <div className="App">
      <DiaryEditor onCreate={onCreate} />
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
