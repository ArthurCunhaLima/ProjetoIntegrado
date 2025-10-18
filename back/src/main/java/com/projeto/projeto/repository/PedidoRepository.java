package com.projeto.projeto.repository;

import com.projeto.projeto.model.Item;
import com.projeto.projeto.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
}
