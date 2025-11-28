document.addEventListener('DOMContentLoaded', function() {
    // Adiciona animação suave aos cards
    const cards = document.querySelectorAll('.item-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Ajusta o contraste para melhor legibilidade
    function adjustContrast() {
        const backgroundColor = document.body.style.backgroundColor;
        const textColor = document.body.style.color;
        
        // Se as cores forem muito similares, ajusta automaticamente
        if (backgroundColor && textColor) {
            // Remove o # das cores hex
            const hexFundo = backgroundColor.replace('#', '');
            const hexTexto = textColor.replace('#', '');
            
            // Converte para RGB
            const rFundo = parseInt(hexFundo.substr(0,2), 16);
            const gFundo = parseInt(hexFundo.substr(2,2), 16);
            const bFundo = parseInt(hexFundo.substr(4,2), 16);
            
            const rTexto = parseInt(hexTexto.substr(0,2), 16);
            const gTexto = parseInt(hexTexto.substr(2,2), 16);
            const bTexto = parseInt(hexTexto.substr(4,2), 16);
            
            // Calcula diferença de brilho (fórmula de luminosidade)
            const brightnessFundo = (rFundo * 299 + gFundo * 587 + bFundo * 114) / 1000;
            const brightnessTexto = (rTexto * 299 + gTexto * 587 + bTexto * 114) / 1000;
            
            const difference = Math.abs(brightnessFundo - brightnessTexto);
            
            // Se a diferença for muito pequena, ajusta automaticamente
            if (difference < 125) {
                document.body.style.color = brightnessFundo > 128 ? '#000000' : '#FFFFFF';
            }
        }
    }
    
    // Executa o ajuste de contraste
    setTimeout(adjustContrast, 100);
});
