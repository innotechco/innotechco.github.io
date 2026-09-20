/* The price is a number and a currency, never a typed-out string: the basket
   has to add these up, and a total cannot be made out of "$5,410". How it is
   written - the symbol, the separators, which digits - is the locale's
   business, which is what Intl is for.

   Its own file rather than a corner of the page, because the buy card shows the
   same price and neither should have to import the other. */
function Price({amount, compareAt, currency, className = ""}) {
  const format = (value) =>
    new Intl.NumberFormat(document.documentElement.lang || "en", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(value);

  if (typeof amount !== "number") return null;

  return (
    <span className={`inlearn-course-price ${className}`}>
      <span className="inlearn-course-price-now">{format(amount)}</span>
      {/* Only when there is one, and struck through: a price with nothing to
          compare it to is just the price. */}
      {typeof compareAt === "number" && compareAt > amount ? (
        <s className="inlearn-course-price-was">{format(compareAt)}</s>
      ) : null}
    </span>
  );
}

export default Price;
