import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  makeStyles,
  Snackbar,
  Backdrop,
  CircularProgress,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useAuth } from '../context/AuthContext';
const useStyles = makeStyles({
  card: {
    width: 300,
    margin: '10px',
  },
  media: {
    height: 200,
    resizeMode: 'contain',
    margin:2,

  },
  textStyle: {
    fontFamily: 'Merriweather',
    fontSize: '15px',
    color: 'black',

  },
  textStyle2: {
    fontFamily: 'Merriweather',
    fontSize: '17px',
    color: '#3498db',

  },
});

const ProductsPage = () => {
  const date = Date.now();
  const [productID, setProductID] = useState(date);
  const [productTitle, setProductTitle] = useState("");
  const [productImage, setProductImage] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [formVisible, setFormVisible] = useState(false);
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/products/');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  // const constructImageUrl = (imageName) => {
  //   // Assuming your server is serving static files from the 'public' folder
  //   const type = "PNG";
  //   return require(`../images/${imageName}.${type}`);
  // };
  
  const handleAddToCart = async (product) => {
    try {
      setLoading(true);

      const { ProductTitle, Price, Quantity } = product;
      const ShopCartID = user.shopCartID;
      // console.log('ShopCartID in add to cart:', ShopCartID);
      // console.log('ShopCartID:', ShopCartID);

      const response = await fetch('http://localhost:3001/api/cartItems/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ShopCartID,
          Price,
          ProductName: ProductTitle,
          Quantity,
        }),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        console.log('Product added to cart:', addedProduct);

        showSuccessSnackbar('Product added to cart');
      } else {
        console.error('Error adding product to cart:', response.status, response.statusText);
        showErrorSnackbar('Failed to add product to cart');
      }
    } catch (error) {
      console.error('API Error:', error);
      showErrorSnackbar('Failed to add product to cart');
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    try {
      setLoading(true);
      // console.log('ShopCartID in add to cart:', ShopCartID);
      // console.log('ShopCartID:', ShopCartID);
      e.preventDefault();

      const response = await fetch('http://localhost:3001/api/products/add-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ProductID: productID,
          ProductTitle: productTitle,
          ProductImage: productImage,
          Price: price,
          Quantity: quantity,
        }),
      });

      if (response.ok) {
        const addedProduct = await response.json();
        console.log('Product added:', addedProduct);

        showSuccessSnackbar('Product added');
      } else {
        console.log("hellooooooooooooo");
        console.error('Error adding product:', response.status, response.statusText);
        showErrorSnackbar('Failed to add product');
      }
      setProductID(0);
      setProductImage("");
      setProductTitle("");
      setQuantity(1);
      setPrice(0);
    } catch (error) {
      console.error('API Error:', error);
      showErrorSnackbar('Failed to add product');
    } finally {
      setLoading(false);
    }
  };
  const showSuccessSnackbar = (successMessage) => {
    setSnackbarSeverity('success');
    setSnackbarMessage(successMessage);
    setSnackbarOpen(true);
  };

  const showErrorSnackbar = (errorMessage) => {
    setSnackbarSeverity('error');
    setSnackbarMessage(errorMessage);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };
  return (
    <div
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
      }}
      >
      <div style={{
        width: "100%",
        display: "flex",
        justifyContent: 'flex-end',
        alignItems: "center",
        
      }}>
        <span style={{
          marginRight: "20px",
          padding: "5px 10px",
          border: "1px solid #0058CC",
          color: "#0058CC",
          borderRadius: "4px",
          cursor: "pointer",
        }} onClick={() =>
          setFormVisible(true)
        }>
          Add product
        </span>
      </div>
      <h1
      style={{
        fontFamily: 'Merriweather',
        fontSize: '30px',
        color: '#3498db',
        margin: '20px',
      
      }}
      >Products Catalog</h1>
      <div
     style={{
      justifyContent: 'center',
      alignItems: 'center',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '20px',
    }} 
      >
      {products.map((product) => (
        <Card key={product.ProductID} className={classes.card}>
          <CardMedia
            className={classes.media}
            // image={constructImageUrl(product.ProductImage)}
            image={product.ProductImage}
            title={product.ProductTitle}
          />
          <CardContent
        
          >
            <Typography variant="h6"
            className={classes.textStyle2}
            >{product.ProductTitle}</Typography>
            <Typography variant="body2"   className={classes.textStyle}>
              Price: ${product.Price}
            </Typography>
            <Typography variant="body2"  className={classes.textStyle}>
              Quantity: {product.Quantity}
            </Typography>
          </CardContent>
          <CardActions>
            <Button 
             style={{
              backgroundColor: '#3498db',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              border: 'none',
              fontSize: '12px',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              fontFamily: 'Merriweather',
            }}
            onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
            onClick={() => handleAddToCart(product)}
            >
              Add to Cart
            </Button>
          </CardActions>
        </Card>
      ))}
      {formVisible && (
        <div style={{
          // maxWidth: "600px",
          maxWidth: "500px",
          width: "100%",
          margin: "30px auto",
          padding: "20px",
          backgroundColor: "#fff",
          borderRadius: "5px",
          position: "absolute",
          top: "80px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
          }}>
            <span
            style={{
              position: "absolute",
              height: "10px",
              width: "10px",
              right: "10px",
              top: "10px",
              cursor: "pointer",
              padding: "5px",
              // border: "2px solid #000",
              borderRadius: "100%",
              boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"
            }}
            onClick={() => {
              setFormVisible(false);
              setProductID(0);
              setProductImage("");
              setProductTitle("");
              setQuantity(1);
              setPrice(0);
            }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill='#000' d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </span>
            <h2 style={{textAlign: "center"}}>Medicine Form</h2>
            <form id="medicineForm" style={{display: "flex", flexDirection: "column"}} onSubmit={handleSubmit}>
                <label htmlFor="productTitle" style={{marginBottom: "5px"}}>Product Title:</label>
                <input type="text" id="productTitle" value={productTitle} 
                onChange={(e) => {
                  const item = e.target.value;
                  setProductTitle(item); 
                }} name="ProductTitle" required style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }} />
                
                <label htmlFor="price" style={{marginBottom: "5px"}}>Price:</label>
                <input type="number" min="0" id="price" value={price}
                onChange={(e) => {
                  const item = e.target.value;
                  setPrice(item); 
                }}
                name="price" required style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }} />
                
                <label htmlFor="quantity" style={{marginBottom: "5px"}}>Quantity:</label>
                <input id="quantity" min="1" value={quantity} 
                onChange={(e) => {
                  const item = e.target.value;
                  setQuantity(item); 
                }}
                type="number" name="quantity" required style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}></input>
                
                {/* <label for="productImage" style={{marginBottom: "20px"}}>Image:</label>
                <input type="file" id="productImage" name="productImage" accept="image/*" required style={{marginBottom: "20px"}} /> */}
                <label htmlFor="productImage" style={{marginBottom: "5px"}}>Image URL:</label>
                <input id="productImage" type="text" value={productImage}
                onChange={(e) => {
                  const item = e.target.value;
                  setProductImage(item); 
                }}
                name="productImage" required style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  boxSizing: "border-box"
                }}></input>
                
                <input type="submit" value="Submit"
                // onClick={() => handleFormSubmit()}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "16px"
                }} />
            </form>
          </div>
      )

      }
        
      </div>
     {/* Snackbar */}
     <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

      {/* Backdrop for loading indicator */}
      <Backdrop className={classes.backdrop} open={loading}
      style={{
        zIndex: 2,
        color: '#fff',
      
      }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default ProductsPage;
