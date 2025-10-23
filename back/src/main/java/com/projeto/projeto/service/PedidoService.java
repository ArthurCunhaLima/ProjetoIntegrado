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
            return pedido.get().adicionarItem(item);
        }else {
            throw new RuntimeException("Pedido não encontrado");
        }
    }
    //public String RemoverItem(Item item, long idPedido){
    //    Optional<Pedido> pedido = pedidoRepository.findById(idPedido);
    //    /// esse return tão errado
    //    if (pedido.isPresent()){
    //        return "";
    //    } return "";
    //}

}
