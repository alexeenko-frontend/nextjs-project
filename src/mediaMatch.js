import { createMediaMatcher } from "react-media-match";

export const SecodaryMedia = createMediaMatcher({
  mobile: "(max-width: 991px)",
  desktop: "(min-width: 992px)"
});
