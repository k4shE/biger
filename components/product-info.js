const productInfo = {
    chatsargana: {
        name: "ЧАЦАРГАНЫ ДАРС",
        image: "/images/dars2.png",
        description: "Aged twice what the law requires, each sip reveals flavors of sweet caramel and vanilla, woody grain and oak. Taste more than 225 years of craft in each bottle.",
        benefitsTitle: "ЧАЦАРГАНЫ АШИГ ТУС",
        bannerImage: "/images/ch-wine.jpg",
        benefits: "Уг жимс нь маш бага хэмжээний нягтралтай уураг агуулдаг бөгөөд энэ нь артерийн судасны хана гэмтэхээс хамгаалдаг. Мөн ханиадыг зогсоох, цусыг шингэрүүлэх зүрх судасны системийн эргэлтийг сайжруулахад нэн ач тустай.",
        benefitsImage: "/images/seabuckthorne.png",
    },
    kharmag: {
        name: "ХАРМАГИЙН ДАРС",
        image: "/images/dars1.png",
        description: "Aged twice what the law requires, each sip reveals flavors of sweet caramel and vanilla, woody grain and oak. Taste more than 225 years of craft in each bottle.",
        benefitsTitle: "ХАРМАГИЙН АШИГ ТУС",
        bannerImage: "/images/wine-banner.png",
        benefits: "Уг жимс нь маш бага хэмжээний нягтралтай уураг агуулдаг бөгөөд энэ нь артерийн судасны хана гэмтэхээс хамгаалдаг. Мөн ханиадыг зогсоох, цусыг шингэрүүлэх зүрх судасны системийн эргэлтийг сайжруулахад нэн ач тустай.",
        benefitsImage: "/images/harmag.jpg"
    },
    ners: {
        name: "НЭРСНИЙ ДАРС",
        image: "/images/dars3.png",
        description: "Aged twice what the law requires, each sip reveals flavors of sweet caramel and vanilla, woody grain and oak. Taste more than 225 years of craft in each bottle.",
        benefitsTitle: "НЭРСНИЙ АШИГ ТУС",
        bannerImage: "/images/ners-banner.png",
        benefits: "Уг жимс нь маш бага хэмжээний нягтралтай уураг агуулдаг бөгөөд энэ нь артерийн судасны хана гэмтэхээс хамгаалдаг. Мөн ханиадыг зогсоох, цусыг шингэрүүлэх зүрх судасны системийн эргэлтийг сайжруулахад нэн ач тустай.",
        benefitsImage: "/images/blueberry.png"
    },
    whisky: {
        name: "GOBI ALTAI ВИСКИ",
        image: "/images/whisky2.png",
        description: "Aged twice what the law requires, each sip reveals flavors of sweet caramel and vanilla, woody grain and oak. Taste more than 225 years of craft in each bottle.",
        benefitsTitle: "ВИСКИ АШИГ ТУС",
        bannerImage: "/images/whiskey-banner.png",
        benefits: "Виски нь исгэсэн үр тариагаар хийсэн алкохолны төрөл юм. Төрөл бүрийн үр тариа, арвай, эрдэнэ шиш, хөх тариа, улаан буудай зэрэг янз бүрийн сортууд ашиглагддаг. Вискиг ихэвчлэн шатсан цагаан царс модоор хийгдсэн модон торхонд дарж хадгалдаг.",
        benefitsImage: "/images/whisky3.jpg"
    },
    champagne: {
        name: "ШАМПАНЬНЫ ДАРС",
        image: "/images/champagne.png",
        description: "A sparkling wine that combines the elegance of champagne with a refreshing zest. Each sip delivers a balance of fruitiness, acidity, and a crisp finish.",
        benefitsTitle: "ШАМПАНЬНЫ АШИГ ТУС",
        bannerImage: "/images/ch-wine.jpg",
        benefits: "Шампанийн дарс нь маш бага калори агуулдаг бөгөөд нүдний эрүүл мэнд, арьсны чийгшил, цусны эргэлт сайжруулахад ашигтай. Мөн хэт их хооллолтын дараа шингэн тэнцвэрийг хадгалахад тусална.",
        benefitsImage: "/images/harmag.jpg",
    }
};

const urlParams = new URLSearchParams(window.location.search);
const product = urlParams.get("product") || "chatsargana"; 

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("product-name").innerText = productInfo[product].name;
    document.getElementById("product-image").src = productInfo[product].image;
    document.getElementById("product-description").innerText = productInfo[product].description;
    document.getElementById("product-benefits-title").innerText = productInfo[product].benefitsTitle;
    document.getElementById("banner-image").src = productInfo[product].bannerImage;
    document.getElementById("ben-image").src = productInfo[product].benefitsImage;
    document.getElementById("product-benefits").innerText = productInfo[product].benefits;
});
