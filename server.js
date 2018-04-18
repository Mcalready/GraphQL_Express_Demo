/**
 * Created by gui.zhang on 10/4/18.
 * GraphQl演示获取用户信息和添加用户信息
 */

const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

//获取express实例
const app = express();

// get router
const router = express.Router()

//服务端口
const port = process.env.PORT || 4000

//本地数据用作演示
const myDB = [{ 
  "name"     : "gui.zhang",
  "age"      : "18",
  "sex"      : "male",
  "describe" : "monkey or programmer or a man"
},{
  "name"     : "gui.zhang.mom",
  "age"      : "47",
  "sex"      : "female",
  "describe" : "my mom"
},{
  "name"     : "gui.zhang.father",
  "age"      : "48",
  "sex"      : "male",
  "describe" : "my father"
}]

//定义schema模型
//查询数据需要在Query下建模型
//增加或者更新数据需要在Mutation下建模型
//多个不同的变更接受相同的输入参数时候，用input关键字来定义输入类型
const schema = buildSchema(` 
    type User{  
      name: String  
      sex: String  
      age: String 
      describe: String
    } 

    input UserInput {
      name: String
      sex: String
      age: String
      describe: String
    }

    type Query {  
      user(id:Int!):User
      users: [User]
    }

    type Mutation{
        addUser(userInfo:UserInput):User
    }
`);  

//定义服务端数据
const root= {
  //获取单条用户数据
  user: ({id}) =>  {
      return myDB[id];
  },

  //  以上查询数据时的url传参格式
  // {
  //    user(id: "0") {
  //       name
  //       sex
  //       age
  //       describe
  //     }
  //   }


  //获取全部用户数据
  users: () => {
      return myDB;
  },

  //  以上查询数据时的url传参格式
  // {
  //    users {
  //       name
  //       sex
  //       age
  //       describe
  //     }
  //   }

  //添加用户信息
  addUser: ({userInfo}) => {
      const user={
          name:userInfo.name,
          sex:userInfo.sex,
          age:userInfo.age,
          describe:userInfo.describe
      };
      myDB.push(user);
      return user;
  }

  //  以上添加或者更新数据时的url传参格式
  //  mutation{
  //     	addUser(userInfo: {
  //         name: "gui.zhang.son",
  //         sex: "male",
  //         age: "10",
  //         describe: "son is son,father is father"
  //       }) { //更新成功后返回的数据
  //    	  name
  //     	  sex
  //     	  age
  //    	  describe
  //     	}
  //    }
};

//API: http://localhost:4000/graphql/userInfo
router.use('/userInfo', graphqlHTTP({
  schema: schema,     //传入scheme
  rootValue: root,    //传入数据
  graphiql: true,     //打开GUI界面
}));

app.use('/graphql', router)

app.listen(port); 




