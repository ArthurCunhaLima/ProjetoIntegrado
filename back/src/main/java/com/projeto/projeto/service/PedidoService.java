package com.projeto.projeto.service;


import com.projeto.projeto.model.Item;
import com.projeto.projeto.model.Pedido;
import com.projeto.projeto.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PedidoService {
    private final PedidoRepository pedidoRepository;

    public PedidoService(PedidoRepository pedidoRepository) {
        this.pedidoRepository = pedidoRepository;
    }


    public String AdicionarItem(Item item, long idPedido){
        Optional<Pedido> pedido = pedidoRepository.findById(idPedido);

        if (pedido.isPresent()){
            pedido.get().getItensPedido().add(item);
            return "Item adicionado com sucesso";
        }else {
            throw new RuntimeException("Pedido não encontrado");
        }
    }

    public String RemoverItem(Item item, long idPedido){
        Optional<Pedido> pedido = pedidoRepository.findById(idPedido);
        if (pedido.isPresent()){
            pedido.get().getItensPedido().remove(item);
            return "item removido com sucesso";
        } throw new RuntimeException("Pedido não encontrado");
    }

}
