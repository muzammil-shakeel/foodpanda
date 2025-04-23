// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, deleteField } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
// import { getAuth,
//    createUserWithEmailAndPassword,
//    signInWithEmailAndPassword,
//    onAuthStateChanged,
//    signOut } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
// const firebaseConfig = {
//   apiKey: "AIzaSyBeuSWSebR248N6KXyXDU0UTsKSJcj5lL8",
//   authDomain: "foodpanda-84a21.firebaseapp.com",
//   projectId: "foodpanda-84a21",
//   storageBucket: "foodpanda-84a21.firebasestorage.app",
//   messagingSenderId: "715287100673",
//   appId: "1:715287100673:web:7537bd541cfbaa19bfaf00",
//   measurementId: "G-LNKPPWVGM9"
// };


// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

//    onAuthStateChanged(auth, (user) => {
//   if (user) {
 
//     const uid = user.uid;
//     console.log("User Is Signed In With UID:", uid);
//     // if u have to stop refreshing itself automatically use this it will tell u in which page your in and will not let user shift the page
//     console.log(location.pathname)
//     // ye khud se condition lagainge
//     if (
//       (location.pathname === "/index.html" || location.pathname === "/login.html") &&
//       location.pathname !== "/signup.html"
//     ) {
//       // setTimeout(() => {
//         location.href = "/admin.html";
//       // }, 2000);
//     }

//   } else {
//     console.log("Not Login")
//   }
// });
// onAuthStateChanged(auth, (user) => {
//   const currentPath = location.pathname;
//   console.log("Auth state changed on:", currentPath);


//   if (user) {
//     // Only redirect if user is on login or index page
//     const publicPages = ["/", "/index.html", "/login.html"];
//     const shouldRedirect = publicPages.includes(currentPath);

//     if (shouldRedirect) {
//       console.log("Redirecting to admin...");
//       setTimeout(() => {
//         location.href = "/admin.html";
//       }, 2000);
//     } else {
//       console.log("User logged in, but staying on", currentPath);
//     }

//   } else {
//     console.log("User is not logged in");
//   }
// });

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeuSWSebR248N6KXyXDU0UTsKSJcj5lL8",
  authDomain: "foodpanda-84a21.firebaseapp.com",
  projectId: "foodpanda-84a21",
  storageBucket: "foodpanda-84a21.firebasestorage.app",
  messagingSenderId: "715287100673",
  appId: "1:715287100673:web:7537bd541cfbaa19bfaf00",
  measurementId: "G-LNKPPWVGM9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Redirect if user is already signed in
onAuthStateChanged(auth, (user) => {
  if (user) {
    const path = location.pathname;
    if (path === "/index.html" || path === "/login.html") {
      location.href = "/admin.html";
    }
  }
});

// Signup handler
async function handleSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  try {
    const existingUsers = await getDocs(collection(db, "users"));
    const userExists = existingUsers.docs.some(doc => doc.data().email === email);
    if (userExists) {
      Swal.fire({ icon: "error", title: "Account Exists", text: "Account already exists. Please log in." });
      return;
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await addDoc(collection(db, "users"), { email, role });

    Swal.fire({ title: "Sign up Successful", text: user.email, icon: "success" });

    if (role === "admin") {
      window.location.href = "/admin.html";
    } else {
      window.location.href = "/shop.html";
    }
  } catch (error) {
    Swal.fire({ icon: "error", title: "Signup Failed", text: error.message });
  }
}
window.handleSignup = handleSignup;

// Login handler
function handleLogin() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      Swal.fire({ title: "Login Successful", text: user.email, icon: "success" });
    })
    .catch((error) => {
      Swal.fire({ icon: "error", title: "Login Failed", text: "Invalid credentials." });
    });
}
window.handleLogin = handleLogin;

// Logout handler
function logoutUser() {
  signOut(auth)
    .then(() => {
      Swal.fire({ title: "Signed Out", text: "You have been logged out.", icon: "success" }).then(() => {
        window.location.href = "login.html";
      });
    })
    .catch((error) => {
      Swal.fire({ icon: "error", title: "Error", text: "Could not sign out." });
    });
}
window.logoutUser = logoutUser;

// Submit new product
async function submitProduct() {
  const product_id = document.getElementById("productId").value;
  const product_name = document.getElementById("productName").value;
  const product_price = document.getElementById("productPrice").value;
  const product_disc = document.getElementById("productDescription").value;
  const product_url = document.getElementById("productImage").value;

  try {
    const docRef = await addDoc(collection(db, "items"), {
      product_id,
      product_name,
      product_price,
      product_disc,
      product_url
    });

    Swal.fire({ title: "Product Added", text: `Your Order ID is: ${docRef.id}`, icon: "success" });
    getProductList();
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
window.submitProduct = submitProduct;

// Get product list
let getProductListDiv = document.getElementById("product-list");
async function getProductList() {
  getProductListDiv.innerHTML = "";
  const querySnapshot = await getDocs(collection(db, "items"));

  querySnapshot.forEach((doc) => {
    getProductListDiv.innerHTML += `
      <div class="card shadow-sm" style="width: 18rem;">
        <img src="${doc.data().product_url}" class="card-img-top" alt="Product Image">
        <div class="card-body">
          <h5 class="card-title">${doc.data().product_name}</h5>
          <p class="card-text">${doc.data().product_disc}</p>
          <h5 class="card-title">$${doc.data().product_price}</h5>
          <button class="btn btn-info">Edit</button>
          <button class="btn btn-danger" onclick='deleteItem("${doc.id}")'>Delete</button>
        </div>
      </div>`;
  });
}
window.getProductList = getProductList;

// Delete item
async function deleteItem(id) {
  try {
    await deleteDoc(doc(db, "items", id));
    getProductList();
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}
window.deleteItem = deleteItem;
