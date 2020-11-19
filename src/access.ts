
// src/access.ts
export default function access(initialState: { currentUser?: API.UserProfile | undefined }) {
  const { currentUser } = initialState || {};
  const endKey:string ="list"
  let canAdminStr:string=""
  let canAdminPermissionStr:string=""
  if(currentUser&&currentUser.role_permission){
    currentUser.role_permission.map(item=>{
      if (item.name.substr(-endKey.length,endKey.length)===endKey){
        canAdminStr+=item.name;
      }else{
        canAdminPermissionStr+=item.name;
      }
      return true;
    });
  }
  
  return {
    canAdmin: currentUser,
    normalRouteFilter:(route: any) =>{
      if(currentUser&&currentUser.role_permission){

        if(!route.apiPath){
          return true;
        }

  
       
        if(canAdminStr.length<=0){
          return false;
        }
        const RouteList:string[]=[];

       
       
        if(route.routes&&route.routes.length>0){
          route.routes.forEach((element: { apiPath: string; }) => {
            if(element.apiPath){
              RouteList.push(element.apiPath);
            }
            
          });
        }else{
          RouteList.push(route.apiPath);
        }
        let result:boolean=false;
        // eslint-disable-next-line no-restricted-syntax
        for (const value of RouteList) {
          if (canAdminStr.indexOf(value)!==-1) {
            result=true;
            break;
          }
        }
        return result;


      }

        return false;
      
    },
    canEnable:(permissionString:string)=>{
      return canAdminPermissionStr.indexOf(permissionString)!==-1;

    }
  };


}
