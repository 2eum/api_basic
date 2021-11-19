import React, { useState, useEffect } from "react";
import * as S from "./MusicCardGrid.elements";
import { MusicCard, MusicCardOpened } from "..";
import axios from "axios";

const MusicCardGrid = ({ currUser, token, userId, list }) => {
  const [content, setContent] = useState(null);
  const [openCard, setOpenCard] = useState(0);
  // const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    setContent();
    if (list && list.length) {
      setContent(list);
    }
  }, [list]);

  useEffect(() => {
    if (!list) {
      axios({
        method: "get",
        url: `/api/recentmusic/0`,
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
          setContent(data["music list"]);
        });
    }
  }, []);

  const handleClick = (clickedCard) => {
    setOpenCard(clickedCard);
    // console.log(content["music list"][openCard][0]);
    console.log(openCard);
  };

  const MusicCardList = content
    ? content.map((c, i) => {
        return (
          <S.MusicCardWrapper
            key={i}
            onclick={() => handleClick(i)}
            open={openCard === i}
          >
            <MusicCard
              title={c[0]}
              artist={c[1]}
              cover={c[2]}
              source={c[3]}
              link={c[4]}
              cardIndex={i}
              handleClick={handleClick}
              open={openCard === i}
            />
          </S.MusicCardWrapper>
        );
      })
    : [];

  return (
    <>
      {content ? (
        <>
          <S.MusicListContainer>{MusicCardList}</S.MusicListContainer>
          <MusicCardOpened
            currUser={currUser}
            token={token}
            userId={userId}
            // open={open}
            cardIndex={openCard}
            title={content[openCard] ? content[openCard][0] : ""}
            artist={content[openCard] ? content[openCard][1] : ""}
            cover={content[openCard] ? content[openCard][2] : ""}
            source={content[openCard] ? content[openCard][3] : ""}
            link={content[openCard] ? content[openCard][4] : ""}
          />
        </>
      ) : (
        ""
      )}
    </>
  );
};

export default MusicCardGrid;
