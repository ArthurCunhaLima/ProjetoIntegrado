package com.projeto.projeto.dto;

import com.projeto.projeto.model.Cardapio;

public class CardapioResponseDTO {
    private Cardapio cardapio;
    private String qrCodeDataUrl;
    private String cardapioUrl;

    public CardapioResponseDTO() {}

    public CardapioResponseDTO(Cardapio cardapio, String qrCodeDataUrl, String cardapioUrl) {
        this.cardapio = cardapio;
        this.qrCodeDataUrl = qrCodeDataUrl;
        this.cardapioUrl = cardapioUrl;
    }

    public Cardapio getCardapio() {
        return cardapio;
    }

    public void setCardapio(Cardapio cardapio) {
        this.cardapio = cardapio;
    }

    public String getQrCodeDataUrl() {
        return qrCodeDataUrl;
    }

    public void setQrCodeDataUrl(String qrCodeDataUrl) {
        this.qrCodeDataUrl = qrCodeDataUrl;
    }

    public String getCardapioUrl() {
        return cardapioUrl;
    }

    public void setCardapioUrl(String cardapioUrl) {
        this.cardapioUrl = cardapioUrl;
    }
}
