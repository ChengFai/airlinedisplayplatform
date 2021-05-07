<template>
	<el-form
		ref="loginForm"
		:model="loginForm"
		:rules="loginRule"
		class="login_form"
		:class="{ signin: cIsLogin, signup: !cIsLogin }"
	>
		<el-form-item class="input_container" prop="username">
			<p>用户名</p>
			<input
				placeholder="请输入用户名"
				v-model="loginForm.username"
				@keydown.enter="cIsLogin ? signinBtnClick() : signupBtnClick()"
			/>
			<el-input v-model="loginForm.username" v-show="false"></el-input>
		</el-form-item>
		<el-form-item class="input_container" prop="password">
			<p>密码</p>
			<input
				placeholder="请输入密码"
				type="password"
				v-model="loginForm.password"
				@keydown.enter="cIsLogin ? signinBtnClick() : signupBtnClick()"
			/>
			<el-input v-model="loginForm.password" v-show="false"></el-input>
		</el-form-item>
		<el-button
			class="login_btn signin_btn"
			v-if="cIsLogin"
			@click="signinBtnClick"
		>
			登 录
		</el-button>
		<el-button class="login_btn signup_btn" v-else @click="signupBtnClick">
			注 册
		</el-button>
	</el-form>
</template>

<script>
export default {
	name: "LoginForm",
	data() {
		return {
			loginForm: {
				username: "",
				password: "",
			},
			loginRule: {
				username: [{ required: true, message: "请输入用户名" }],
				password: [
					{ required: true, message: "请输入密码" },
					{ min: 5, max: 10, message: "长度在 5 到 10 个字符" },
				],
			},
		}
	},
	methods: {
		signinBtnClick() {
			// 验证表单数据合法性
			this.$refs["loginForm"].validate(async (valid) => {
				if (valid) {
					const { username, password } = this.loginForm
					await this._signinReq(username, password) // 调用登录函数
				}
			})
		},
		signupBtnClick() {
			this.$refs["loginForm"].validate(async (valid) => {
				if (valid) {
					const { username, password } = this.loginForm
					const { data: result } = await this.$http.post("api/users/signup", {
						username,
						password,
					})
					if (result.meta.status == 1) {
						// 注册成功 -> 应当进行登录
						await this._signinReq(username, password) // 调用登录函数
					} else {
						// 注册失败
						this.$message({ type: "error", message: result.meta.msg })
					}
				}
			})
		},
		// 处理登录请求的内部函数
		_signinReq(username, password) {
			return new Promise(async (resolve, reject) => {
				const result = await this.$http.post("/api/users/signin", {
					username,
					password,
				})
				if (result.data.meta.status == 1) {
					// 获得成功结果
					const token = result.headers["x-access-token"] // 获取token
					window.sessionStorage.setItem("token", token) // 将token存储在session中
					this.$message({ type: "success", message: "登录成功" })
					this.$router.push("/home") // 跳转至home页
					resolve()
				} else {
					this.$message({ type: "error", message: result.data.meta.msg })
					reject()
				}
			})
		},
	},
	props: {
		cIsLogin: {
			type: Boolean,
		},
	},
}
</script>

<style lang="less" scoped>
.login_form {
	width: 75%;
	display: flex;
	align-items: center;
	flex-direction: column;

	&.signin {
		color: @signinColor;

		input {
			border-bottom: 0.1rem solid @signinColor;
		}
		::-webkit-input-placeholder {
			color: @signinColor;
		}
	}

	&.signup {
		color: @signupColor;

		input {
			border-bottom: 0.1rem solid @signupColor;
			color: whitesmoke;
		}
		::-webkit-input-placeholder {
			color: @signupColor;
		}
	}

	input {
		border: none;
		outline: none;
		background-color: transparent;
		width: 100%;
		height: 30px;
	}
}

.input_container {
	margin-bottom: 10px;
	width: 100%;
	font-size: 1.3rem;
	font-weight: 500;

	p {
		margin-bottom: 10px;
	}
}

.login_btn {
	width: 70%;
	height: 3rem;
	border-radius: 3.5rem;
	border: none;
	margin: 2rem 0;
	cursor: pointer;
	color: white;
	font-weight: 600;
	font-size: 1rem;
	&.signin_btn {
		background: linear-gradient(90deg, #4b69b9, #6a89cc);
		box-shadow: 0 0 8px @signinColor;
	}
	&.signup_btn {
		background: linear-gradient(90deg, #ffbe76, #fad390);
		box-shadow: 0 0 8px @signupColor;
	}
}
</style>