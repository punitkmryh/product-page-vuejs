Vue.component("product-review", {
  template: `
   <form class="review-form" @submit.prevent="onSubmit">
      
      <p v-if="errors.length">
        <b>Please checkout the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Product Review:</label>      
        <textarea id="review" v-model="review" placeholder="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Product Rating:</label>
        <select id="rating" v-model.number="rating" >
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        // storing review in object
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        this.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name is required");
        if (!this.review) this.errors.push("Review required");
        if (!this.rating) this.errors.push("Rating required");
      }
    },
  },
});

Vue.component("product-details", {
  props: {
    details: { type: Array, required: true },
  },
  template: `
  <div>
  <h4>Product Details</h4>
          <ul>
            <li v-for="detail in details">{{detail}}</li>
          </ul>
  </div>`,
});

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
        <div class="product">
        <div class="product-image">
          <img v-bind:src="image" />
        </div>

        <div class="product-info">
          <h1 :style="{fontSize:fontSize}">{{title + ' 🧦'}}</h1>
          <div class="stock" style="color:#0c7dc9">
            <p v-if="inStock > 10">In Stock</p>
            <p v-else-if=" inStock <= 10 && inStock > 0">
              Few Product left!
            </p>
            <p v-else :class="{outOfStock:!inStock}" :style="{color:fontColor}">
              Out Of Stock
            </p>
            
          </div>
          <p>{{Sale}}</p>
          
          <h3 style="color:#16c0b0">Shipping: {{shipping}}</h3>
          
          <product-details :details="details"></product-details>
          
          <h4>Select Color Variant</h4>
          <div
            v-for="(variant,index) in variants"
            :key="variant.variantId"
            class="color-box"
            :style="{backgroundColor:variant.variantColor}"
            @mouseover="updateImage(index)"
          ></div>
          <br />
          <div>
          <button
            v-on:click="addToCart"
            :disabled="!inStock"
            :class="{disabledButton:!inStock}"
          >
            Add to Cart
          </button>
          
          <button v-on:click="removeCart">Remove form Cart</button>
          </div> 
          <div>
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews yet!</p>
        <ul>
          <li v-for='review in reviews'>
          <p>Username: {{review.name}}</p>
          <p>Rating: {{review.rating}}</p>
          <p>Review: {{review.review}}</p>
          </li>
        </ul>
        </div>        
        </div>
        

        <div class="review">
        <h2 align='center'> Product Review</h2>
        <product-review @review-submitted="addReview" ></product-review>
        </div>
      </div>
      `,
  data() {
    return {
      brand: "VueMastery",
      product: "Socks",
      selectedVariantIndex: 0,
      details: ["80% cotton", "20% polyester", "Gender - unisex"],
      fontSize: "35px",
      fontColor: "Red",
      variants: [
        {
          variantId: 123,
          variantColor: "Green",
          variantImage: "../assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 0,
        },
        {
          variantId: 124,
          variantColor: "Blue",
          variantImage: "../assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 110,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart() {
      // updates `cart` variable in data attribute
      // this.cart += 1;
      this.$emit(
        "add-to-cart",
        this.variants[this.selectedVariantIndex].variantId
      ); //emitting event
    },
    removeCart() {
      this.$emit("remove-cart");
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    },
    updateImage(index) {
      // Updating `image` data in data attribute/property
      // this.image = variantImage;
      this.selectedVariantIndex = index;
      console.log(index);
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariantIndex].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariantIndex].variantQuantity;
    },
    Sale() {
      if (this.variants[this.selectedVariantIndex].variantQuantity > 0) {
        return this.brand + " " + this.product + " " + "are on sale";
      }
      return this.brand + " " + this.product + " " + "not on sale";
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return "$2";
    },
  },
});

// Creating new `Vue instance` -> Heart of Vue
var app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeCart(id) {
      this.cart.pop(id);
    },
  },
});
