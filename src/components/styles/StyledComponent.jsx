import { Skeleton, keyframes, styled } from "@mui/material";
import { Link as LinkComponent } from "react-router-dom";
import { greyColor } from "../../constants/color";

const VisuallyHiddenInput = styled("input")({
  border: "0",
  clip: "rect(0 0 0 0)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
});

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: white;
  padding: 1rem;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(30px);
    border-radius: 10px;
    box-shadow: 0px 0px 14px 0px hsl(261, 100%, 52%);
    border-bottom: 2px solid #610cff;
    z-index: 1;
    height: 83px;
  }
`;

const InputBox = styled("input")`
  width: 100%;
  height: 100%;
  border: none;
  outline: none;
  padding: 0 4rem;
  border-radius: 1.5rem;
  background-color: ${greyColor};
`;

const SearchField = styled("input")`
  padding: 0.6rem 2rem;
  width: 22vmax;
  border: none;
  outline: none;
  border-radius: 1.5rem;
  background-color: #f1f1f1;
  font-size: 1.1rem;
`;

const CurveButton = styled("button")`
  border-radius: 1.5rem;
  padding: 0.4rem 0.7rem;
  border: none;
  outline: none;
  cursor: pointer;
  background-color: black;
  color: white;
  font-size: 1rem;
  align-items: center;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
`;

const bouncingAnimation = keyframes`
0% {transform:scale(1);}
50% {transform:scale(1.5);}
100% {transform:scale(1);}
`;

const BouncingSkeleton = styled(Skeleton)(() => ({
  animation: `${bouncingAnimation} 1s infinite`,
}));

export {
  VisuallyHiddenInput,
  Link,
  InputBox,
  SearchField,
  CurveButton,
  BouncingSkeleton,
};
