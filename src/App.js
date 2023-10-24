import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import "./App.css";
import DiaryEditor from "./DiaryEditor";
import DiaryList from "./DiaryList";

// 상태 변화 처리 함수
const reducer = (state, action) => {
  switch (action.type) {
    case "INIT": {
      return action.data;
    }
    case "CREATE": {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date,
      };
      return [newItem, ...state]; // state는 원래값을 뜻한다.
    }
    case "REMOVE": {
      return state.filter((it) => it.id !== action.targetId);
    }
    case "EDIT": {
      return state.map((it) =>
        it.id === action.targetId ? { ...it, content: action.newContent } : it
      );
    }
    default:
      return state;
  }
};

// Context - data만 전달
export const DiaryStateContext = React.createContext(); // export default는 파일당 1개만 가능
// 중첩 Context - 리렌더링 방지하기 위해서 (onRemove, onEdit 넘겨주기 위해)
export const DiaryDispatchContext = React.createContext();

function App() {
  const BASE_URL = "https://jsonplaceholder.typicode.com/comments";
  const [data, dispatch] = useReducer(reducer, []); // state도 가지고 있다.

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

    dispatch({ type: "INIT", data: initData });
  };

  // Mount 되자마자 API에서 데이터 불러오기
  useEffect(() => {
    getData();
  }, []);

  // useCallback으로 의존성배열이 바뀔 때마다 메모제이션된 콜백함수를 실행해서 반환
  // onCreate가 바뀌면 자식 컴포넌트도 리렌더링 되어서 불필요한 리렌더링 발생 >> 해결방안: useCallback 필요
  const onCreate = useCallback((author, content, emotion) => {
    dispatch({
      type: "CREATE",
      data: { author, content, emotion, id: dataId.current },
    });
    dataId.current += 1;
  }, []);

  const onRemove = useCallback((targetId) => {
    dispatch({
      type: "REMOVE",
      targetId,
    });
  }, []);

  const onEdit = useCallback((targetId, newContent) => {
    dispatch({
      type: "EDIT",
      targetId,
      newContent,
    });
  }, []);

  // 재생성되지 않게 메모제이션 (provider의 value에 전달하기 위해 묶음)
  const memoizedDispatches = useMemo(() => {
    return { onCreate, onRemove, onEdit };
  }, []);

  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis; // useMemo는 값이므로 함수가 아니다. 그래서 호출하면 안 된다.

  return (
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          <DiaryEditor onCreate={onCreate} />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {~~goodRatio}%</div>
          <DiaryList onEdit={onEdit} onRemove={onRemove} />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
