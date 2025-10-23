package com.projeto.projeto.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Item> itensPedido = new ArrayList<>();
    private float valorTotal;
    private float valorEntrega;
    private float valorItens;

    public Pedido(List<Item> itensPedido, float valorEntrega, float valorItens){
        this.itensPedido = itensPedido;
        this.valorTotal = valorEntrega+valorItens;
        this.valorItens = valorItens;
        this.valorEntrega = valorEntrega;
    }

    public float getValorItens() {
        return valorItens;
    }

    public void setValorItens(float valorItens) {
        this.valorItens = valorItens;
    }

    public float getValorEntrega() {
        return valorEntrega;
    }

    public void setValorEntrega(float valorEntrega) {
        this.valorEntrega = valorEntrega;
    }

    public float getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(float valorTotal) {
        this.valorTotal = valorTotal;
    }

    public List<Item> getItensPedido() {
        return itensPedido;
    }

    public void setItensPedido(List<Item> itensPedido) {
        this.itensPedido = itensPedido;
    }
    public String adicionarItem(Item item){
        this.itensPedido.add(item);
        return "Item adicionado com sucesso";
    }

    public String removerItem(Item item,long id){
        this.itensPedido.remove(id-1);
        return "Item removido com sucesso";
    }
}
