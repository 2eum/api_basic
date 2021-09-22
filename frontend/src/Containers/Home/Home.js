import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  TodayPostContainer,
  Date,
  TodayMessage,
  PostContainer,
  ContentWrapper,
  PrevArrowContainer,
  NextArrowContainer,
  ContentTitle,
  ContentAuthor,
  ContentSummary,
  CreateButtonArea,
  CreateMessage,
  CreateButton,
} from "./Home.elements";

import { MusicCard } from "..";
import { BoldSpan } from "../../globalStyles";

const Home = () => {
  const [content, setContent] = useState(null);
  const [loaded, setLoad] = useState(false);
  const [contentIdx, setIdx] = useState(0);
  const [placeholder, setPlaceholder] = useState("Loading Content");

  useEffect(() => {
    axios({
      method: "get",
      url: "/musicdiary/",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Token ff59ee976035b0ade661ea26b7a2ec277ee752c6",
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

  return (
    <>
      <TodayPostContainer>
        {loaded === false ? (
          <p>{placeholder}</p>
        ) : (
          <>
            <Date>2021년 9월 12일</Date>
            <TodayMessage>누군가의 오늘 하루, 그리고 음악.</TodayMessage>
            <PostContainer>
              <PrevArrowContainer to="/">
                <i className="fas fa-chevron-left"></i>
              </PrevArrowContainer>
              <MusicCard />
              <ContentWrapper>
                <ContentTitle>
                  {content[contentIdx].title}
                  <ContentAuthor>by {content[contentIdx].user}</ContentAuthor>
                </ContentTitle>
                <ContentSummary>{content[contentIdx].content}</ContentSummary>
              </ContentWrapper>
              <NextArrowContainer to="/">
                <i className="fas fa-chevron-right"></i>
              </NextArrowContainer>
            </PostContainer>
          </>
        )}
      </TodayPostContainer>
      <CreateButtonArea>
        <CreateMessage>
          오늘, <BoldSpan>당신의 하루</BoldSpan> 어떤 <BoldSpan>선율</BoldSpan>
          이었나요?
        </CreateMessage>
        <CreateButton>내 이야기 쓰러가기</CreateButton>
      </CreateButtonArea>
    </>
  );
};

export default Home;
