import React, { useEffect, useState } from "react";
import { TitleContainer, TitleBar, TitleText } from "./style";
import { Dance } from "../../constants/types";
import { getUserDetail } from "../../apis/user";

function SideSubTitle(props: {
  title: string;
  contents: { icon: string; text: string }[];
  score?: number;
  myUrl?: string;
  dance: Dance;
}) {
  const [userData, setUserData] = useState<any>();
  useEffect(() => {
    getUserDetail()
      .then((res) => {
        console.log(res);
        setUserData(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleKakaoClick = () => {
    const shareUrl = "https://j8a501.p.ssafy.io/dance/" + props.dance.id;
    const videoUrl = props.dance.url;
    window.Kakao.Share.sendDefault({
      objectType: "feed",
      content: {
        title: `${props.dance.title} ${props.score}점`,
        description: `${userData?.nickname}님이 ${props.dance.title}챌린지에서 ${props.score}점을 기록했습니다.`,
        imageUrl: props.dance.thumbnailPath,
        link: {
          mobileWebUrl: videoUrl,
          webUrl: videoUrl,
        },
      },
      social: {
        likeCount: props.dance.likeCount,
        viewCount: props.dance.viewCount,
        subscriberCount: props.dance.userCount,
      },
      buttons: [
        {
          title: "나도 도전하기",
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });
  };

  const handleClickDownload = () => {
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");
    a.href = props.myUrl!;
    const fileName = convertFileName(props.dance.title);
    a.download = fileName + "_" + props.score + "점.webm";
    a.click();
    window.URL.revokeObjectURL(props.myUrl!);
  };

  const convertFileName = (fileName: string) => {
    var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;

    if (special_pattern.test(fileName) == true) {
      fileName = fileName.replace(/[`~!@#$%^&*|\\\'\";:\/?]/gi, "");
    }
    return fileName;
  };

  return (
    <TitleContainer>
      <TitleText>{props.title}</TitleText>
      <TitleBar />
      {props.contents.map((content, i) => {
        return (
          <TitleText key={i}>
            <div>{content.icon}</div>
            <div>{content.text}</div>
          </TitleText>
        );
      })}
    </TitleContainer>
  );
}

export default SideSubTitle;
