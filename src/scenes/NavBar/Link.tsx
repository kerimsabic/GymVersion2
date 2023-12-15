import { SelectedPage } from "@/shared/types";
import AnchorLink from "react-anchor-link-smooth-scroll"

type Props = {
    page: string;
    selectedPage:SelectedPage;
    setSelectedPage: (value:SelectedPage)=>void;
}

const Link = ({page,selectedPage,setSelectedPage}: Props) => {
    const lowerCasePage= page.toLowerCase().replace(/ /g, "") as SelectedPage; // to make a name of the (home, about us,...) to lowercase and remove space between to make it as an id in order to put it in the href
  return (
    <AnchorLink
      className={`${selectedPage === lowerCasePage ? "text-primary-500" : ""}
        transition duration-500 hover:text-primary-300
      `}
      href={`#${lowerCasePage}`}
      onClick={() => setSelectedPage(lowerCasePage)}
    >
      {page}
    </AnchorLink>
  )
}

export default Link