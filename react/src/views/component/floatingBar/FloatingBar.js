import { Container, Button, lightColors, darkColors } from 'react-floating-action-button'
//https://www.npmjs.com/package/react-floating-action-button


function FloatingBar() {
    return (
        <Container>
            <Button
                tooltip="The big plus button!11"
                icon="fas fa-plus"
                rotate={true}/>
            <Button
                tooltip="The big plus button!"
                icon="fas fa-plus"
                rotate={true}/>
            <Button
                icon="fas fa-plus"
                styles={{backgroundColor: lightColors.green, color: lightColors.black}}
                rotate={true}/>
        </Container>
    );
  }
  
  export default FloatingBar;
  