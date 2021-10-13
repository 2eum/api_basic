import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  TodayPostContainer,
  BannerDate,
  TodayMessage,
  QuestionWrapper,
  PostContainer,
  ContentWrapper,
  ArrowContainer,
  ContentTitle,
  ContentAuthor,
  ContentSummary,
  CreateButtonArea,
  CreateMessage,
  CreateButton,
  QuestionAnswerLink,
} from "./Home.elements";

import { MusicCard } from "..";
import { BoldSpan } from "../../globalStyles";

const Home = ({ token }) => {
  const [content, setContent] = useState(null);
  const [question, setQuestion] = useState("");
  const [questionId, setQuestionId] = useState("");
  const [loaded, setLoad] = useState(false);
  const [contentIdx, setIdx] = useState(0);
  const [placeholder, setPlaceholder] = useState("Loading Content");

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
        setQuestion(data[0].question_content);
        return data;
      })
      .then((data) => {
        setQuestionId(data[0].id);
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
      <TodayPostContainer>
        {loaded === false ? (
          <p>{placeholder}</p>
        ) : (
          <>
            <BannerDate>{todayString}</BannerDate>
            <TodayMessage>누군가의 오늘 하루, 그리고 음악.</TodayMessage>
            <QuestionWrapper>오늘의 질문: {question}</QuestionWrapper>
            <QuestionAnswerLink to={`/new/${questionId}`}>
              질문에 답하기
            </QuestionAnswerLink>
            {content[contentIdx] ? (
              <PostContainer>
                <ArrowContainer onClick={() => changeArticle("prev")}>
                  <i className="fas fa-chevron-left"></i>
                </ArrowContainer>
                <MusicCard />
                <ContentWrapper>
                  <ContentTitle to={`detail/${content[contentIdx].id}`}>
                    {content[contentIdx].title}
                    <ContentAuthor>by {content[contentIdx].user}</ContentAuthor>
                  </ContentTitle>
                  <ContentSummary>{content[contentIdx].content}</ContentSummary>
                </ContentWrapper>
                <ArrowContainer onClick={() => changeArticle("next")}>
                  <i className="fas fa-chevron-right"></i>
                </ArrowContainer>
              </PostContainer>
            ) : (
              ""
            )}
          </>
        )}
      </TodayPostContainer>
      <CreateButtonArea>
        <CreateMessage>
          오늘, <BoldSpan>당신의 하루</BoldSpan> 어떤 <BoldSpan>선율</BoldSpan>
          이었나요?
        </CreateMessage>
        <CreateButton to="/new">내 이야기 쓰러가기</CreateButton>
      </CreateButtonArea>
    </>
  );
};

export default Home;
