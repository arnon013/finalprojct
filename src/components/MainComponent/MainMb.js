import React, { Component } from "react";
import Products from "../CartComponent/Products";
import Cate from "./Cate";
import Basket from "../CartComponent/Basket";

class MainMb extends Component {
  constructor() {
    super();
    this.state = {
      size: "",
      sort: "",
      cartItems: [],
      products: [],
      filteredProducts: []
    };
  }
  componentWillMount() {
    if (localStorage.getItem("cartItems")) {
      this.setState({
        cartItems: JSON.parse(localStorage.getItem("cartItems"))
      });
    }

    let url = "https://www.api.senpru.com/signalinfo/index.php/propart/fetchMb";

    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({ products: data[0].products });
        this.listProducts();
      });

    // fetch("http://www.api.senpru.com/signalinfo/index.php/propart/fetchall")
    //   .then(res => res.json())
    //   .then(data => data.products

    //     )

    //   .then(data => {
    //     this.setState({ products: data });

    //     this.listProducts();

    //   });
  }

  handleRemoveFromCart = (e, product) => {
    this.setState(state => {
      const cartItems = state.cartItems.filter(a => a.id !== product.id);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { cartItems: cartItems };
    });
  };

  handleAddToCart = (e, product) => {
    this.setState(state => {
      const cartItems = state.cartItems;
      let productAlreadyInCart = false;

      cartItems.forEach(cp => {
        if (cp.id === product.id) {
          cp.count += 1;
          productAlreadyInCart = true;
        }
      });

      if (!productAlreadyInCart) {
        cartItems.push({ ...product, count: 1 });
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      return { cartItems: cartItems };
    });
  };

  listProducts = () => {
    this.setState(state => {
      if (state.sort !== "") {
        state.products.sort((a, b) =>
          state.sort === "lowestprice"
            ? a.price > b.price
              ? 1
              : -1
            : a.price < b.price
            ? 1
            : -1
        );
      } else {
        state.products.sort((a, b) => (a.id > b.id ? 1 : -1));
      }
      if (state.size !== "") {
        return {
          filteredProducts: state.products.filter(
            a => a.availableSizes.indexOf(state.size.toUpperCase()) >= 0
          )
        };
      }
      return { filteredProducts: state.products };
    });
  };
  handleSortChange = e => {
    this.setState({ sort: e.target.value });
    this.listProducts();
  };
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
    this.listProducts();
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Cate />
            <Products
              products={this.state.filteredProducts}
              handleAddToCart={this.handleAddToCart}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default MainMb;
