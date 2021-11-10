import React, { useState, useEffect } from "react";
import axios from "axios";

import * as e from "./Home.elements";
import * as com from "../../Components";
import { LoadMoreButtonL, LoadMoreButtonR } from "../../Components/LoadMoreButton/LoadMoreButton";
import { New } from "..";
import { BoldSpan } from "../../globalStyles";

const Home = ({ currUser, token, userId }) => {
  const [content, setContent] = useState(null);
  const [questionList, setQList] = useState([]);
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [loaded, setLoad] = useState(false);
  const [contentIdx, setIdx] = useState(0);
  const [placeholder, setPlaceholder] = useState("Loading Content");

  // on Mount
  useEffect(() => {
    axios({
      method: "get",
      url: "/api/question/past",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status > 400) {
          setPlaceholder("Something went wrong!");
        }
        return response.data;
      })
      .then((data) => {
        const sortedArray = [...data];
        sortedArray.sort((a, b) => sortByLatest(a, b));
        setQList(sortedArray);
      });

    axios({
      method: "get",
      url: "/api/musicdiary/",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status > 400) {
          setPlaceholder("Something went wrong!");
        }
        return response.data;
      })
      .then((data) => {
        setContent(data);
      })
      .then(() => {
        setLoad(true);
      });
  }, []);

  // on question list change
  useEffect(() => {
    if (questionList[0]) {
      setQuestion(questionList[0].question_content);
      setQuestionId(questionList[0].id);
    }
  }, [questionList]);

  const sortByLatest = (a, b) => {
    const a_date = new Date(a.released_date);
    const b_date = new Date(b.released_date);

    if (a_date > b_date) {
      return -1;
    } else if (b_date > a_date) {
      return 1;
    } else {
      return 0;
    }
  };

  const changeArticle = (direction) => {
    const last = content.length - 1;

    const changeIdx = direction === "prev" ? contentIdx - 1 : contentIdx + 1;

    if (changeIdx > last) {
      setIdx(0);
      return;
    } else if (changeIdx < 0) {
      setIdx(last);
      return;
    } else {
      setIdx(changeIdx);
    }
  };

  const today = new Date();
  const todayString = `${today.getFullYear()}년 ${
    today.getMonth() + 1
  }월 ${today.getDate()}일`;

  return (
    <>
      <e.Background>
        <e.QuestionPageContainer>
            <com.PostCardL/>
            <e.RightContainer>
              <e.QuestionArea>
                <com.ShuffleButton/>
                <e.TodayQuestion>
                  <e.QDate>오늘의 질문</e.QDate>
                  <e.Question>내 인생에서 가장 더웠던 날의 기억</e.Question>
                </e.TodayQuestion>
              </e.QuestionArea>
              <e.PostCardSArea>
                <e.PostCardSWrapper>
                  <LoadMoreButtonL/>
                  <com.PostCardS/><com.PostCardS/>
                  <LoadMoreButtonR/>
                </e.PostCardSWrapper>
                <com.Indicator/>
              </e.PostCardSArea>
            </e.RightContainer>
          </e.QuestionPageContainer>
      </e.Background>
    </>
  );
};

export default Home;
