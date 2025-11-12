package com.projeto.projeto.model;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Cardapio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private String hexFundo;
    private String hexTexto;
    private String url;
    private String nomeEstabelecimento;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Item> itensCardapio;



    public Cardapio(){
    }
    public Cardapio(String hexFundo, String hexTexto, String url, String nomeEstabelecimento, List<Item> itensCardapio) {
        this.hexFundo = hexFundo;
        this.hexTexto = hexTexto;
        this.url = url;
        this.nomeEstabelecimento = nomeEstabelecimento;
        this.itensCardapio = itensCardapio;
    }

    public Cardapio(String nomeEstabelecimento, String hexFundo, String hexTexto, List<Item> itensCardapio) {
        this.hexFundo = hexFundo;
        this.hexTexto = hexTexto;
        this.nomeEstabelecimento = nomeEstabelecimento;
        this.itensCardapio = itensCardapio;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getNomeEstabelecimento() {
        return nomeEstabelecimento;
    }

    public void setNomeEstabelecimento(String nomeEstabelecimento) {
        this.nomeEstabelecimento = nomeEstabelecimento;
    }

    public List<Item> getItensCardapio() {
        return itensCardapio;
    }

    public void setItensCardapio(List<Item> itensCardapio) {
        this.itensCardapio = itensCardapio;
    }

    public String getHexFundo() {
        return hexFundo;
    }

    public void setHexFundo(String hexFundo) {
        this.hexFundo = hexFundo;
    }

    public String getHexTexto() {
        return hexTexto;
    }

    public void setHexTexto(String hexTexto) {
        this.hexTexto = hexTexto;
    }
}
