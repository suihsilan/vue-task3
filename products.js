//引入vue createApp
import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js";

//存好固定api前綴網址
const site = "https://vue3-course-api.hexschool.io/v2/";

//存好固定的api_path
const api_path = "sui-vue";

//全域變數modal宣告在外層(全域都需要使用到)
let productModal = {};
let delProductModal = {};

//vue app 應用程式
const app = createApp({
  data() {
    return {
      products: [], //產品總資料清單存入這裡
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, //確認是編輯或新增所使用的
    };
  },
  methods: {
    getProducts() {
      const url = `${site}api/${api_path}/admin/products/all`;
      axios
        .get(url)
        .then((res) => {
          //取的產品列表後，存入data的products總資料變數
          console.log(res.data.products);
          this.products = res.data.products;
        })
        .catch((err) => {
          //將錯誤情況的訊息明確顯示出來
          console.log(err.data.message);
        });
    },
    //在openModal(status)加入status參數做增編刪情況判斷
    openModal(status, product) {
      if (status === "create") {
        productModal.show();
        this.isNew = true;
        //帶入初始化的資料
        this.tempProduct = {
          imagesUrl: [],
        };
      } else if (status === "edit") {
        productModal.show();
        this.isNew = false;
        //帶入當前要編輯的資料，但因為傳參考的原因，使用淺層拷貝，避免直接更動資料
        this.tempProduct = { ...product };
      } else if (status === "delete") {
        delProductModal.show();
        this.tempProduct = { ...product }; //等等取id使用
      }
    },
    updateProduct() {
      //透過isNew true or false判斷api如何運行：在按下modal視窗下面的確認鍵時，是要post上傳新產品，還是要put 更新產品
      let url = `${site}api/${api_path}/admin/product`;
      let method = "post";
      if (!this.isNew) {
        url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
        method = "put";
      }
      //作api post請求上傳新產品資料
      // const url = `${site}api/${api_path}/admin/product`;
      axios[method](url, { data: this.tempProduct })
        .then(() => {
          //在updateProduct（）內更新/新增資料給伺服器後，需要再觸發this.getProducts()重新取的更新後的資料
          this.getProducts();
          //新增資料之後就會把modal視窗關閉
          productModal.hide();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
    deleteProduct() {
      //存入delete api網址
      const url = `${site}api/${api_path}/admin/product/${this.tempProduct.id}`;
      axios
        .delete(url)
        .then(() => {
          //刪除之後，重新更新資料列表
          this.getProducts();

          // 點選刪除按鈕之後，會把deleteModal關閉
          delProductModal.hide();
        })
        .catch((err) => {
          console.log(err.data.message);
        });
    },
  },
  mounted() {
    //生命週期初始化功能
    const cookieValue = document.cookie
      .split(";")
      .find((row) => row.startsWith("hexToken="))
      ?.split("=")[1];
    //axios headers
    axios.defaults.headers.common["Authorization"] = cookieValue;
    //觸發get總資料
    this.getProducts();

    //bootstrap 方法
    console.log(bootstrap);
    //1.初始化/實體化 new
    //2. 呼叫方法 .show() ｜ .hide()
    //建立新增/編輯產品的視窗
    productModal = new bootstrap.Modal("#productModal");
    // productModal.show(); //只是暫時保持開啟，確保他會動

    //建立刪除產品的視窗
    delProductModal = new bootstrap.Modal("#delProductModal");
  },
});

//生成畫面
app.mount("#app");
