import React,{Fragment} from 'react'
import {lcc,ucc,num,sc,ws} from '../../utils/RegExp'

const PasswordStrength = (props) => {
    const { password } = props;

    const getStrength = (password) =>{
        if(password.length<8)
        return "Poor";
        let cnt=0;
        if(lcc.test(password))cnt++;
        if(ucc.test(password))cnt++;
        if(num.test(password))cnt++;
        if(sc.test(password))cnt++;
        if(cnt===1)return "Good";
        if(cnt===2)return "Good";
        if(cnt===3)return "Good";
        if(cnt===4)return "Good";
    }

    const getText = () => {
        if(ws.test(password))
        return "Password should not contain spaces";
        if(password.length<8)
        return "Password should contain atleast 8 characters";
    }

    return (
        <Fragment>
            <p>Strength : {getStrength(password)}</p>
            <p>{getText(password)}</p>
        </Fragment>
    )
}

export default PasswordStrength
