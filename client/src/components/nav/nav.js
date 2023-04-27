//shared component that inserts common content on all pages (eg. nav bar)
// import "./nav.css";
//import Posts from "./posts.js";
// import Button from "@mui/material/Button";
// import MultilineTextFields from "./new_posts.js";

//button; onClick={showPosts}
const Nav = () => {
  return (
      <div className="container">
        <div className="header">
          <nav id="navbar">
            <img className="logo" src="bcit_logo.png" alt="BCIT logo"></img>
            <div className="btn announcement">
              <button>
                <img
                  // className="icon"
                  src="announcement_image.png"
                  alt="announcement_image"
                  // onClick={<Posts />}
                />
              </button>
            </div>
            <div className="btn home">
              <button>
                <img
                  // className="icon"
                  src="home_image.png"
                  alt="home_image"
                  // onClick={this.myfunction}
                />
              </button>
            </div>
          </nav>

          <h3 className="text-muted">React Blog App</h3>
        </div>
      </div>
  );
};

export default Nav;
