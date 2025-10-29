package com.projeto.projeto.model;


import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Cardapio {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String url;
    private String nomeEstabelecimento;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Item> itensCardapio = new ArrayList<>();


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



}
