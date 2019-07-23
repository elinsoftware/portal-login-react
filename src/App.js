import React, { Component } from 'react';
import './App.css';
import axios from "axios";
import { Form, Icon, Input, Button, Checkbox, message } from "antd";
import loginImg from './login.png'
const FormItem = Form.Item;

class NormalLoginForm extends Component {
  
  isLoggedIn = () => {
    // window.loggedUsername should be defined by UI page / jelly script
    // if it's 'guest' that means there is no active user session
    if (window.loggedUsername==='guest') {
      return false;
    } else {
      return true; // set it to false for local development to prevent passing through
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        var details = {
          sysparm_type: "login",
          "ni.nolog.user_password": true,
          remember_me: values.remember,
          user_name: values.userName,
          user_password: values.password,
          get_redirect_url: true,
          sysparm_goto_url: "navpage.do"
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        axios({
          method: "post",
          url:
            "angular.do?sysparm_type=view_form.login",
          data: formBody,
          config: {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          }
        })
          .then(function(response) {
            if (response.data.status==='error') {
              message.error(response.data.message)
            } else if (response.data.status==='success'){
              message.success(response.data.message)
              setTimeout(()=>{window.location = window.mainAppPage;},500);
            } else {
              message.warning('Unknown response status'+response.data.message)
            }
          })
          .catch(function(response) {
            message.error('Network error. Cannot log in.')
          });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    if (this.isLoggedIn()) {
      window.location = window.mainAppPage;
    }
    return (
      <div>
      <div className={this.isLoggedIn() ? ' ' : ' hidden'}>
        Successfully logged in...
      </div>
      <div className={"lContainer"+(this.isLoggedIn() ? ' hidden' : ' ')}>
      <div className="lItem">
          <div className="loginImage">
            <img src={loginImg} width="300" style={{position: 'relative'}} alt="login"/>
          </div>
          <div className="loginForm">
            <h2>Login</h2>
              <Form onSubmit={this.handleSubmit} className="login-form">
              <FormItem>
                {getFieldDecorator("userName", {
                  rules: [{ required: true, message: "Please enter your username" }]
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
                    placeholder="Username"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("password", {
                  rules: [{ required: true, message: "Please enter your Password" }]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
                    type="password"
                    placeholder="Password"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator("remember", {
                  valuePropName: "checked",
                  initialValue: true
                })(<Checkbox>Remember me</Checkbox>)}
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  Log in
                </Button>
              </FormItem>
            </Form>
          </div>
      </div>
      <div className="footer">
        <a href="" target="_blank" rel="noopener noreferrer" className="footerLink">Powered by React</a>
      </div>
      </div>
      </div>
    );
  }
}

const App = Form.create()(NormalLoginForm);

export default App;
