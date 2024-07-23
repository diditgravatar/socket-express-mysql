function Navigation() {
  const nav = "<h1>Navbar</h1><a href='/'>Index</a>";
  return nav;
}

document.getElementById("navbar").innerHTML = Navigation();
