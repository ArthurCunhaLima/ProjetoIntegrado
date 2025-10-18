package com.projeto.projeto.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.util.List;

public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private List<Item> itensPedido;
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
}
