<template>
    <footer class="footer">
      <div class="footer-content">

        <div class="footer-section">
          <h3>{{$t('ContactUs')}} </h3>
          <ul>
            <li><strong>{{$t('Email')}} :</strong> info@yourwebsite.com</li>
            <li><strong>{{$t('Phone')}} :</strong> +66 123 456 789</li>
            <li><strong>{{$t('Address')}} :</strong> 123 Coconut Street, Coconut City, Thailand</li>
            <li><strong>{{$t('Footer')}}:</strong> Department of Horticulture, Faculty of Agriculture at Kamphaeng Saen, Kasetsart University, Kamphaeng Saen Campus, Nakhon Pathom 73140 </li>

          </ul>
        </div>
        

        <div class="footer-section">
          <h3>{{$t('QuickLinks')}}</h3>
          <ul>
            <li><NuxtLinkLocale to="/aboutus">{{$t('AboutUs')}}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/services">{{$t('Services')}}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/faqs">{{$t('FAQ')}}</NuxtLinkLocale></li>
            <li><NuxtLinkLocale to="/privacy-policy">{{$t('PrivacyPolicy')}}</NuxtLinkLocale></li>
          </ul>
        </div>
  

        <div class="footer-section">
          <h3>{{$t('FollowUs')}}</h3>
          <ul class="social-media-links">
            <li><a href="https://facebook.com/yourpage" target="_blank">Facebook</a></li>
            <li><a href="https://twitter.com/yourprofile" target="_blank">Twitter</a></li>
            <li><a href="https://instagram.com/yourprofile" target="_blank">Instagram</a></li>
            <li><a href="https://linkedin.com/company/yourcompany" target="_blank">LinkedIn</a></li>
          </ul>
        </div>
      </div>
  

      <div class="footer-bottom">
        <p>&copy; 2024 CoconutKnowLedgeHub. All rights reserved.</p>
      </div>
    </footer>
  </template>
  
  <script setup>
  
  </script>
  
  <style scoped>
  .footer {
    background-color: #4E6D16;
    color: #fff;
    padding: 30px;
    text-align: left;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .footer-section {
    flex: 1;
    min-width: 250px;
    margin-right: 20px;
  }
  
  .footer-section h3 {
    font-size: 18px;
    margin-bottom: 15px;
  }
  
  .footer-section ul {
    list-style-type: none;
    padding-left: 0;
  }
  
  .footer-section ul li {
    margin-bottom: 10px;
  }
  
  .footer-section ul li a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .footer-section ul li a:hover {
    color: #ccc;
  }
  
  .social-media-links {
    display: flex;
    gap: 15px;
  }
  
  .social-media-links a {
    color: #fff;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .social-media-links a:hover {
    color: #ccc;
  }
  
  .footer-bottom {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
  }
  
  .footer-bottom p {
    margin: 0;
    color: #ccc;
  }
  </style>
  