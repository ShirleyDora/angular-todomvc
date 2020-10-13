import { Component } from '@angular/core';
const todos=[
  {
    id:1,
    title:'吃饭',
    done:true
  },
  {
    id:2,
    title:'睡觉',
    done:false
  }, 
  {
    id:3,
    title:'学习',
    done:true
  }
]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public todos:{
    id:number,
    title:string,
    done:boolean
  }[] = JSON.parse(window.localStorage.getItem('todos')||'[]')
  public currentEditing:{
    id:number,
    title:string,
    done:boolean
  } = null
  
  //实现导航切换数据过滤的功能
  //1.提供一个属性，该属性会根据当前点击的链接返回过滤之后的数据
  //  filterTodos
  //2.提供一个属性，用来存储当前点击的链接标识
  //  visibility 字符串
  //  all,active,completed
  //3.为链接添加点击事件，当点击导航链接的时候，改变
  public visibility:string = 'all'
  get filterTodos(){
    if(this.visibility === 'all'){
      return this.todos;
    }else if (this.visibility === 'active'){
      return this.todos.filter(t => !t.done);
    }else if (this.visibility === 'completed'){
      return this.todos.filter(t => t.done);
    }
  }
  //该函数是一个特殊的angular生命周期钩子函数
  //它会在angular应用初始化的时候执行一次
  ngOnInit(){
    this.hashchangeHandler();
    //注意：这里要bind this绑定
    window.onhashchange = this.hashchangeHandler.bind(this);
  }
  hashchangeHandler(){
    //console.log('锚点改变了')
      //当用户点击了锚点的时候，我们需要获取当前的锚点标识
      //然后动态的将根组件中的visibility设置为当前点击的锚点标识
      //console.log(this.visibility)
      const hash = window.location.hash.substr(1);
      //console.log(hash)
      switch(hash){
        case '/':
          this.visibility = 'all'
          break;
        case '/active':
          this.visibility = 'active'
          break;
        case '/completed':
          this.visibility = 'completed'
          break;
      }
  }
  //当angular组件数据发生改变时，ngDoCheck钩子函数会被触发
  //要做的就是在这个钩子函数中去持久化存储todos数据
  ngDoCheck(){
    //console.log('ngdocheck')
    window.localStorage.setItem('todos',JSON.stringify(this.todos));
  }
  //添加任务项
  addTodo(e):void{
    // console.log(e.keyCode)
    // console.log('添加方法被调用了')
  //   console.log(e.target.value)
    const titleText = e.target.value;
    if(!titleText.length){
      return;
    }
    const last = this.todos[this.todos.length-1];
    this.todos.push({
      id:last?last.id+1:1,
      title:titleText,
      done:false
    })
    // 清空文本框
    e.target.value='';
    //console.log(this.todos)
  }
  // 全选全不选
  get toggleAll(){
    return this.todos.every(t => t.done)
  }
  set toggleAll(val){
    this.todos.forEach(t => t.done = val)
  }
  //删除任务项
  removeTodo(index:number){
    // console.log(index)
    this.todos.splice(index,1)
  }
  //保存编辑
  saveEdit(todo,e){
    //console.log("保存编辑")
    //保存编辑
    todo.title = e.target.value;
    //去除编辑样式
    this.currentEditing = null;
  }
  //拿到键盘码
  handleEditKeyUp(e){
    const {keyCode,target} = e;
    //如果为ESC的键盘码
    if( keyCode === 27){
      //取消编辑
      //同时把文本框的值恢复为原来的值
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }
  //显示所有剩余的未完成的数目
  get remainingCount(){
    return this.todos.filter( t => !t.done).length;
  }
  //清除所有已完成的任务项
  clearAllDone(){
    this.todos = this.todos.filter(t => !t.done);
  }
}

