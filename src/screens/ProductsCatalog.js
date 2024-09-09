import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  // CardActions,
  CardMedia,
  // Button,
  Typography,
  makeStyles,
} from '@material-ui/core';
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

const ProductsCatalog = () => {
  const classes = useStyles();
  const [products, setProducts] = useState([]);
  const { user } = useAuth();
 console.log('user.ShopCartID:', user.shopCartID);


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
  

  return (
    <>
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
        justifyContent: 'end',
        alignItems: 'center',
        display: 'flex',
      }}>
        button
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
            image={product.ProductImage}
            title={product.ProductTitle}
          />
          <CardContent>
            <Typography className={classes.textStyle2}>{product.ProductTitle}</Typography>
            <Typography className={classes.textStyle}>
              Price: ${product.Price}
            </Typography>
            <Typography className={classes.textStyle}>
              Quantity: {product.Quantity}
            </Typography>
          </CardContent>
         
        </Card>
      ))}
      </div>
      
    </div>
    
    </>
  );
};

export default ProductsCatalog;
