import { useState, useEffect } from "react";
import Nav from "../components/nav";
import commerce from "../lib/commerce";

export default function ShoppingCart() {
  const [items, setItems] = useState([]);
  const [subtotal, setSubtotal] = useState({});
  const [total, setTotal] = useState({});
  const [checkoutURL, setCheckoutURL] = useState("");

  const handleQuantityChange = (id, e) => {
    const quant = parseInt(e.target.value.trim());
    if (!isNaN(quant)) handleUpdateQuantity(id, e.target.value.trim());
  };
  const handleUpdateQuantity = async (id, quantity) => {
    let res = await commerce.cart.update(id, { quantity: quantity });
    let items = res.cart.line_items;
    setItems(items);
    setSubtotal(res.cart.subtotal);
    setTotal(res.cart.subtotal);
  };
  const handleCheckout = () => {
    // for now we're just opening a new window to the hosted checkout
    window.open(checkoutURL);
  };
  useEffect(() => {
    async function fetchCart() {
      let cart = await commerce.cart.retrieve();
      console.log(cart);
      setItems(cart.line_items);
      setSubtotal(cart.subtotal);
      setTotal(cart.subtotal);
      setCheckoutURL(cart.hosted_checkout_url);
    }
    fetchCart();
  }, []);
  return (
    <div>
      <Nav />
      <div className="container mx-auto mt-10">
        <div className="flex shadow-md my-10">
          <div className="w-3/4 bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl">{items.length} Item(s)</h2>
            </div>
            <div className="flex mt-10 mb-5">
              <h3 className="font-semibold text-gray-600 text-xs uppercase w-2/5">
                Product Details
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
                Quantity
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
                Price
              </h3>
              <h3 className="font-semibold text-center text-gray-600 text-xs uppercase w-1/5 text-center">
                Total
              </h3>
            </div>

            {items.map((item, index) => (
              <div
                className="flex items-center hover:bg-gray-100 -mx-8 px-6 py-5"
                key={index}
              >
                <div className="flex w-2/5">
                  <div className="w-20">
                    <img className="h-24" src={item.media.source} alt="" />
                  </div>
                  <div className="flex flex-col justify-between ml-4 flex-grow">
                    <span className="font-bold text-sm">
                      {item.product_name}
                    </span>
                    <a
                      href="#"
                      onClick={() => handleUpdateQuantity(item.id, 0)}
                      className="font-semibold hover:text-red-500 text-gray-500 text-xs"
                    >
                      Remove
                    </a>
                  </div>
                </div>
                <div className="flex justify-center w-1/5">
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    <svg
                      className="fill-current text-gray-600 w-3"
                      viewBox="0 0 448 512"
                    >
                      <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  </button>
                  <input
                    className="mx-2 border text-center w-8"
                    type="text"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, e)}
                  />
                  <button
                    onClick={() =>
                      handleUpdateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    <svg
                      className="fill-current text-gray-600 w-3"
                      viewBox="0 0 448 512"
                    >
                      <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
                    </svg>
                  </button>
                </div>
                <span className="text-center w-1/5 font-semibold text-sm">
                  {item.price.formatted_with_symbol}
                </span>
                <span className="text-center w-1/5 font-semibold text-sm">
                  {item.line_total.formatted_with_symbol}
                </span>
              </div>
            ))}

            <a
              href="/"
              className="flex font-semibold text-indigo-600 text-sm mt-10"
            >
              <svg
                className="fill-current mr-2 text-indigo-600 w-4"
                viewBox="0 0 448 512"
              >
                <path d="M134.059 296H436c6.627 0 12-5.373 12-12v-56c0-6.627-5.373-12-12-12H134.059v-46.059c0-21.382-25.851-32.09-40.971-16.971L7.029 239.029c-9.373 9.373-9.373 24.569 0 33.941l86.059 86.059c15.119 15.119 40.971 4.411 40.971-16.971V296z" />
              </svg>
              Continue Shopping
            </a>
          </div>

          <div id="summary" className="w-1/4 px-8 py-10">
            <h1 className="font-semibold text-2xl border-b pb-8">
              Order Summary
            </h1>
            <div className="flex justify-between mt-10 mb-5">
              <span className="font-semibold text-sm uppercase">
                {items.length} items
              </span>
              <span className="font-semibold text-sm">
                {subtotal.formatted_with_symbol &&
                  subtotal.formatted_with_symbol}
              </span>
            </div>
            <div className="border-t mt-8">
              <div className="flex font-semibold justify-between py-6 text-sm uppercase">
                <span>Total cost</span>
                <span>
                  {total.formatted_with_symbol && total.formatted_with_symbol}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                className="bg-indigo-500 font-semibold hover:bg-indigo-600 py-3 text-sm text-white uppercase w-full"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
