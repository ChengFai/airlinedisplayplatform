<template>
	<div id="login_container">
		<label>
			<div class="card" :class="{ convered: !isSignin }">
				<div class="login_box" id="signin">
					<!-- 遮罩 -->
					<div class="login_blur"></div>
					<div class="login_content">
						<div class="login_title">
							<span>欢迎登录</span>
						</div>
						<LoginForm :c-is-login="isSignin"></LoginForm>
						<el-button
							icon="el-icon-right"
							size="mini"
							round
							plain
							class="switch_btn"
							@click="switchFunc"
							>注册</el-button
						>
					</div>
				</div>
				<div class="login_box" id="signup">
					<!-- 遮罩 -->
					<div class="login_blur"></div>
					<div class="login_content">
						<div class="login_title">
							<span>注册用户</span>
						</div>
						<LoginForm :c-is-login="isSignin"></LoginForm>
						<el-button
							icon="el-icon-right"
							size="mini"
							round
							plain
							class="switch_btn"
							@click="switchFunc"
							>登录</el-button
						>
					</div>
				</div>
			</div>
		</label>
	</div>
</template>

<script>
import LoginForm from "../components/login/LoginForm"

export default {
	name: "Login",
	data() {
		return {
			isSignin: true,
		}
	},
	methods: {
		switchFunc() {
			this.isSignin = !this.isSignin
		},
	},
	components: {
		LoginForm,
	},
}
</script>

<style lang="less" scoped>
#login_container {
	width: 100%;
	height: 100%;
	background: url("../assets/images/login_background.png") no-repeat fixed;
	background-position: center;
	background-size: cover;
	position: relative;
}

label {
	width: 60%;
	height: 70%;
	position: relative;
	top: 50%;
	left: 50%;
	display: block;
	z-index: 10;
	transform: translate(-50%, -50%);
	perspective: 1000px;
}

.card {
	width: 100%;
	height: 100%;
	transform-style: preserve-3d;
	z-index: 20;

	&.convered {
		#signin {
			transform: rotateX(180deg);
		}

		#signup {
			transform: rotateX(360deg);
		}
	}
}

.login_box {
	width: 100%;
	height: 100%;
	border-radius: 10px;
	box-shadow: 0 0 3px 0 rgba(60, 64, 67, 0.2),
		0 0 15px 4px rgba(60, 64, 67, 0.15);
	overflow: hidden;
	backface-visibility: hidden;
	transition: all 600ms;
	position: absolute;

	&#signin {
		.login_blur {
			background: url("../assets/images/login_blur.jpg");
			background-size: 100%;
		}
		.login_content {
			background: @signinBack;
		}
		.login_title {
			color: @signinColor;
			span {
				&::after {
					background: linear-gradient(to right, transparent, @signinColor);
				}
        &::before {
					background: linear-gradient(to left, transparent, @signinColor);
        }
			}
		}
	}

	&#signup {
		transform: rotateX(180deg);

		.login_blur {
			background: url("../assets/images/signup_blur.jpg");
			background-size: 100%;
		}
		.login_content {
			background: @signupBack;
		}
		.login_title {
			color: @signupColor;
			span {
				&::after {
					background: linear-gradient(to right, transparent, @signupColor);
				}
        &::before {
					background: linear-gradient(to left, transparent, @signupColor);
				}
			}
		}
	}

	.login_blur {
		background-position: center;
		filter: blur(10px);
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.login_content {
		position: absolute;
		right: 0;
		height: 100%;
		width: 40%;
		display: flex;
		align-items: center;
		flex-direction: column;

		.login_title {
			margin: 30px 0px 30px 0;
			font-weight: 600;
			font-size: 24px;

			span {
				position: relative;
				padding: 0 10px;
				&::after {
					content: "";
					position: absolute;
					left: 0;
					top: 50%;
					transform: translate(-100%, -50%);
					width: 70%;
					height: 2px;
				}

				&::before {
					content: "";
					position: absolute;
					right: 0;
					top: 50%;
					transform: translate(100%, -50%);
					width: 70%;
					height: 2px;
				}
			}
		}
	}
}
.switch_btn {
	margin-top: 20px;
	margin-right: 20px;
	margin-left: auto;
}
</style>