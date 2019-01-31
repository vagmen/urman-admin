import React from "react";
import { inject, Observer, observer } from "mobx-react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu, Icon } from "antd";
import Posts from "./pages/Posts";
import Home from "./pages/Home";
import LaborCosts from "./pages/LaborCosts";

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
    state = {
        collapsed: false
    };

    onCollapse = collapsed => this.setState({ collapsed });

    render() {
        return (
            <Router>
                <Layout style={{ minHeight: "100vh" }}>
                    <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                        <div className="logo">
                            <Link to="/">
                                <p>URMAN</p>
                            </Link>
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                            <Menu.Item key="1">
                                <Link to="/posts">
                                    <Icon type="copy" />
                                    <span>Статьи</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <Link to="/laborCosts">
                                    <Icon type="dollar" />
                                    <span>Трудозатраты</span>
                                </Link>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{ background: "#fff", padding: 0 }} />
                        <Content style={{ margin: "0 16px" }}>
                            <div style={{ margin: "16px 0", padding: 24, background: "#fff", minHeight: 360 }}>
                                <Route path="/" exact component={Home} />
                                <Route path="/posts/" component={Posts} />
                                <Route path="/laborCosts/" component={LaborCosts} />
                            </div>
                        </Content>
                        {/* <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer> */}
                    </Layout>
                </Layout>
            </Router>
        );
    }
}

export default App;
