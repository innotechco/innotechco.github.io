import ellipseImg from "../assets/EllipseBlack.png";

function EllipseBlack() {
  return (
    <section className="-mt-20 relative z-20 w-full overflow-x-hidden">
      <img src={ellipseImg} alt="Ellipse Background" className="w-full block" />
    </section>
  );
}

export default EllipseBlack;
