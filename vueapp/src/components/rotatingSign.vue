<template>
  <div>
    <h1 class="gillSans text-center">Welcome</h1>
    <div class="mercedesLogo"></div>
    <p class="mercedesClaim">Mercedes-Benz</p>
  </div>
</template>

<script>
export default{
   	components: {
		//
	}
}
</script>

<style scoped>
.gillSans{
    font-family: "Gill Sans", sans-serif;
    font-weight: 100;
    color: black;
    font-size: 90px;
}
.mercedesLogo{
    background: url("../assets/images/mercedesTransparentLogo.png") no-repeat center center;
    border-radius: 4px;
    background-size: 550px; 
    animation: rotation 5s infinite linear;
    height: 420px;
    width: 420px;
    margin: 80px auto 0px auto;
}
@keyframes rotation {
    from{
        transform: rotateY(0deg);
    }
    to{
        transform: rotateY(359deg);
    }
}
.mercedesClaim{
    margin-top: 60px;
    text-align: center;
    font-size: 30px;
}
</style>