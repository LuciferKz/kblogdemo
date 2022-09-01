// align	string	left/right/center	center
// alt	string	image alt attribute	none
// background-color	color	icon color	Each social name has its own default
// border-radius	px	border radius	3px
// color	color	text color	#333333
// css-class	string	class name, added to the root HTML element created	n/a
// font-family	string	font name	Ubuntu, Helvetica, Arial, sans-serif
// font-size	px/em	font size	13px
// font-style	string	font style	normal
// font-weight	string	font weight	normal
// href	url	button redirection url	none
// icon-height	percent/px	icon height, overrides icon-size	icon-size
// icon-size	percent/px	icon size (width and height)	20px
// line-height	percent/px	space between lines	22px
// name	string	social network name, see supported list below	N/A
// padding	px	supports up to 4 parameters	4px
// padding-bottom	px	bottom offset	n/a
// padding-left	px	left offset	n/a
// padding-right	px	right offset	n/a
// padding-top	px	top offset	n/a
// icon-padding	px	padding around the icon	0px
// text-padding	px	padding around the text	4px 4px 4px 0
// sizes	media query & width	set icon width based on query	n/a
// src	url	image source	Each social name has its own default
// srcset	url & width	set a different image source based on the viewport	n/a
// rel	string	specify the rel attribute for the link	n/a
// target	string	link target	_blank
// title	string	img title attribute	none
// text-decoration	string	underline/overline/none	none
// vertical-align	string	top/middle/bottom	middle

const font = {
  "font-family": "Ubuntu, Helvetica, Arial, sans-serif",
  "font-size": "13px",
  "font-style": "normal",
  "font-weight": "normal",
};

export const KitxSocialElementAttributes = {
  ...font,
  align: "center",
  alt: "",
  "background-color": "",
  "border-radius": "11px",
  color: "#333333",
  "css-class": "n/a",
  href: "none",
  "icon-height": "20px",
  "icon-size": "20px",
  "line-height": "22px",
  name: "",
  padding: "4px",
  "padding-bottom": "n/a",
  "padding-left": "n/a",
  "padding-right": "n/a",
  "padding-top": "n/a",
  "icon-padding": "0px",
  "text-padding": "4px 4px 4px 0",
  sizes: "n/a",
  src: "",
  srcset: "",
  rel: "n/a",
  target: "_blank",
  title: "none",
  "text-decoration": "none",
  "vertical-align": "middle",
};
